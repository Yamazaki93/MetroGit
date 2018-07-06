const { ipcMain } = require('electron');
const { requireArgParams } = require('../infrastructure/handler-helper');
const path = require('path');
const NodeGit = require('nodegit');
const uuid = require('uuid');
var Repo;
var window = null;
var refreshInterval;
var fileRefreshSubscriptions = {};

ipcMain.on('Repo-Open', openRepo);
ipcMain.on('Repo-Close', closeRepo);
ipcMain.on('Repo-GetFileDetail', requireArgParams(getFileDetailWrapper, ['file', 'commit']))
ipcMain.on('Repo-SubscribeFileUpdate', requireArgParams(subscribeUpdate, ['file', 'commit']))
ipcMain.on('Repo-UnsubscribeFileUpdate', requireArgParams(unsubscribeUpdate, ['id']));

function init(win) {
    window = win;
    window.on('close', (event) => {
        clearInterval(refreshInterval);
        unsubscribeAllUpdate();
    })
}

function closeRepo(event, arg) {
    Repo = null;
    clearInterval(refreshInterval);
    unsubscribeAllUpdate();
}

function openRepo(event, arg) {
    Repo = null;
    clearInterval(refreshInterval);
    unsubscribeAllUpdate();
    if (arg.workingDir) {
        NodeGit.Repository.open(arg.workingDir).then(res => {
            Repo = res;
            refreshInterval = setInterval(() => {
                getStatus()
            }, 5 * 1000);
            getStatus()
        })
    }
}

function getStatus() {
    if (Repo && window) {
        return Repo.getStatus().then((statuses) => {
            let stagedSummary = {
                ignored: 0,
                newCount: 0,
                deleted: 0,
                modified: 0,
                renamed: 0
            }
            let unstagedSummary = {
                ignored: 0,
                newCount: 0,
                deleted: 0,
                modified: 0,
                renamed: 0
            }
            let staged = [];
            let unstaged = [];
            let result = statuses.forEach(status => {
                let item = {
                    path: status.path(),
                    isNew: status.isNew(),
                    isModified: status.isModified(),
                    isRenamed: status.isRenamed(),
                    isIgnored: status.isIgnored(),
                    isDeleted: status.isDeleted(),
                }
                if (status.inIndex()) {
                    staged.push(item);
                    if (status.isNew()) {
                        stagedSummary.newCount += 1;
                    } else if (status.isModified()) {
                        stagedSummary.modified += 1;
                    } else if (status.isIgnored()) {
                        stagedSummary.ignored += 1;
                    } else if (status.isRenamed()) {
                        stagedSummary.rename += 1;
                    } else if (status.isDeleted()) {
                        stagedSummary.deleted += 1;
                    }
                }
                if (status.inWorkingTree()) {
                    unstaged.push(item);
                    if (status.isNew()) {
                        unstagedSummary.newCount += 1;
                    } else if (status.isModified()) {
                        unstagedSummary.modified += 1;
                    } else if (status.isIgnored()) {
                        unstagedSummary.ignored += 1;
                    } else if (status.isRenamed()) {
                        unstagedSummary.rename += 1;
                    } else if (status.isDeleted()) {
                        unstagedSummary.deleted += 1;
                    }
                }
            });
            window.webContents.send('Repo-FileStatusRetrieved', {
                staged: staged,
                unstaged: unstaged,
                stagedSummary: stagedSummary,
                unstagedSummary: unstagedSummary,
                summary: {
                    ignored: stagedSummary.ignored + unstagedSummary.ignored,
                    newCount: stagedSummary.newCount + unstagedSummary.newCount,
                    deleted: stagedSummary.deleted + unstagedSummary.deleted,
                    modified: stagedSummary.modified + unstagedSummary.modified,
                    renamed: stagedSummary.renamed + unstagedSummary.renamed
                }
            });
            return Promise.resolve();
        });
    }
}

function getFileDetailWrapper(event, arg) {
    if (Repo) {
        getFileDetail(arg.file, arg.commit, arg.fullFile).then(result => {
            event.sender.send('Repo-FileDetailRetrieved', result);
        }).catch(err => {
            if (err === 'FILE_NOT_FOUND') {
                event.sender.send('Repo-FileDetailNotFound', {});
            }
        })
    }
}

function subscribeUpdate(event, arg) {
    let subID = uuid.v4();    
    fileRefreshSubscriptions[subID] = setInterval(() => {
        getFileDetail(arg.file, arg.commit, arg.fullFile).then(result => {
            event.sender.send('Repo-FileDetailRetrieved', result);
        }).catch(err => {
            if (err === 'FILE_NOT_FOUND') {
                event.sender.send('Repo-LiveUpdateFileNotFound', {});
            }
        });
    }, 3 * 1000);
    event.returnValue = subID;
}

function unsubscribeUpdate(event, arg) {
    if(fileRefreshSubscriptions[arg.id]) {
        clearInterval(fileRefreshSubscriptions[arg.id]);
        delete fileRefreshSubscriptions[arg.id];
    }
}

function getFileDetail(path, commit, fullFile = false) {
    if (commit !== 'tree' && commit !== 'workdir') {
        return Repo.getCommit(commit).then(x => {
            return x.getDiff().then(diffs => {
                diff = diffs[0]
                return diff
            }).then(diff => {
                return processDiff(diff, path, commit, fullFile);
            })
        });
    } else if (commit === 'workdir') {
        return NodeGit.Diff.indexToWorkdir(Repo, null, {
            flags: NodeGit.Diff.OPTION.SHOW_UNTRACKED_CONTENT | NodeGit.Diff.OPTION.RECURSE_UNTRACKED_DIRS
        }).then(diff => {
            return processDiff(diff, path, commit, fullFile);
        })
    } else {
        let index;
        return Repo.index().then(ind => {
            index = ind;
            return Repo.getHeadCommit().then(cmt => {
                return cmt.getTree()
            });
        }).then(tree => {
            return NodeGit.Diff.treeToIndex(Repo, tree, index);
        }).then(diff => {
            return processDiff(diff, path, commit, fullFile);
        })
    }
}

function processDiff(diff, path, commit, fullFile = false) {
    return diff.findSimilar({ renameThreshold: 50 }).then(() => {
        return diff.patches()
    }).then(patches => {
        let patch;
        patches.forEach(p => {
            if (p.newFile().path() === path) {
                patch = p;
            }
        });
        if (patch) {
            return patch.hunks().then(hunks => {
                let req = [];
                hunks.forEach(function (hunk) {
                    req.push(hunk.lines());
                });
                return Promise.all(req);
            }).then(hunks => {
                let result = [];
                hunks.forEach(lines => {
                    result.push({
                        lines: []
                    });
                    lines.forEach(function (line) {
                        let isNewLine = String.fromCharCode(line.origin()) === '<' || String.fromCharCode(line.origin()) === '>' || String.fromCharCode(line.origin()) === '='
                        result[result.length - 1].lines.push({
                            op: String.fromCharCode(line.origin()),
                            content: isNewLine ? line.content().trim() : line.content(),
                            oldLineno: line.oldLineno(),
                            newLineno: line.newLineno(),
                        });
                    });
                });
                return Promise.resolve(result);
            }).then(result => {
                let linesAdded = 0;
                let linesRemoved = 0;
                result.forEach(h => {
                    h.lines.forEach(l => {
                        if (l.op === '+') {
                            linesAdded += 1;
                        } else if (l.op === '-') {
                            linesRemoved += 1;
                        }
                    })
                })
                if (!fullFile) {
                    return { path: path, paths: path.split('/'), commit: commit, hunks: result, summary: { added: linesAdded, removed: linesRemoved } };
                } else {
                    return getFileLines(commit, path).then(hunkLikeLines => {
                        for (let j = 0; j < result.length; j++) {
                            for (let i = 0; i < hunkLikeLines.length; i++) {
                                if (hunkLikeLines[i].newLineno === result[j].lines[0].newLineno ||
                                    hunkLikeLines[i].newLineno === result[j].lines[0].oldLineno) {
                                    // found a line with a hunk starting the line
                                    // get ending line number
                                    let lastLineNum = result[j].lines[result[j].lines.length - 1].newLineno;
                                    // get endling line index in hunkLikeLines
                                    let iEnd;
                                    for (iEnd = i; iEnd < hunkLikeLines.length; iEnd++) {
                                        if (hunkLikeLines[iEnd].newLineno === lastLineNum) {
                                            break;
                                        }
                                    }
                                    let lineCount = iEnd - i + 1;
                                    // clear oldLineno in result[j].lines
                                    result[j].lines.map(l => {
                                        if (l.op !== '+' && l.op !== '-') {
                                            l.oldLineno = -1
                                        }
                                    })
                                    hunkLikeLines.splice(i, lineCount, ...result[j].lines);
                                    break;
                                }
                            }
                        }
                        let hunks;
                        if (hunkLikeLines.length === 0) {
                            hunks = result;
                        } else {
                            hunks = [{ lines: hunkLikeLines }];
                        }
                        return { path: path, paths: path.split('/'), commit: commit, hunks: hunks, summary: { added: linesAdded, removed: linesRemoved } };
                    })
                }

            });
        } else {
            return Promise.reject('FILE_NOT_FOUND');
        }
    });
}

function getFileLines(commit, path) {
    let getCmtPromise;
    if (commit === 'workdir' || commit === 'tree') {
        getCmtPromise = Repo.getHeadCommit();
    } else {
        getCmtPromise = Repo.getCommit(commit)
    };
    return getCmtPromise.then(cmt => {
        return cmt.getTree();
    }).then(tree => {
        return tree.getEntry(path);
    }).then(treeEntry => {
        if (treeEntry.isFile()) {
            return treeEntry.getBlob();
        } else {
            return Promise.reject('PATH_NOT_FILE');
        }
    }).then(blob => {
        if (blob.isBinary()) {
            return [{ op: "binary", content: "Binary File Content", oldLineno: -1, newLineno: -1 }]
        }
        let lines = blob.toString().split(/\r?\n/);
        let hunkLike = lines.map((l, index) => {
            return {
                op: "",
                content: l,
                oldLineno: -1,
                newLineno: index + 1
            }
        })
        return hunkLike;
    }).catch(err => {
        return Promise.resolve([]);
    });
}

function unsubscribeAllUpdate(){
    let subs = Object.keys(fileRefreshSubscriptions);
    subs.forEach(s => {
        clearInterval(fileRefreshSubscriptions[s]);
        delete fileRefreshSubscriptions[s];
    });
}

module.exports = {
    init: init,
    getStatus: getStatus,
    getFileDetail: getFileDetail,
}