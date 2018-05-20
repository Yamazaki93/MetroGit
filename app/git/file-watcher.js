const { ipcMain } = require('electron');
const { requireArgParams } = require('../infrastructure/handler-helper');
const path = require('path');
const NodeGit = require('nodegit');
var Repo;
var window = null;
var refreshInterval;

ipcMain.on('Repo-Open', openRepo);
ipcMain.on('Repo-GetFileDetail', requireArgParams(getFileDetailWrapper, ['file', 'commit']))

function init(win) {
    window = win;
    window.on('close', (event) => {
        clearInterval(refreshInterval);
    })
}

function openRepo(event, arg) {
    Repo = null;
    clearInterval(refreshInterval);
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
        getFileDetail(arg.file, arg.commit).then(result => {
            event.sender.send('Repo-FileDetailRetrieved', result);
        }).catch(err => {
        })
    }
}

function getFileDetail(path, commit) {
    if (commit !== 'tree' && commit !== 'workdir') {
        return Repo.getCommit(commit).then(x => {
            return x.getDiff().then(diffs => {
                diff = diffs[0]
                return diff
            }).then(diff => {
                return processDiff(diff, path);
            })
        });
    } else if (commit === 'workdir') {
        return Repo.getHeadCommit().then(cmt => {
            return cmt.getTree()
        }).then(tree => {
            return NodeGit.Diff.treeToWorkdir(Repo, tree);
        }).then(diff => {
            return processDiff(diff, path, commit);
        })
    } else {
        let index;
        return Repo.refreshIndex().then(() => {
            return Repo.index();
        }).then(ind => {
            index = ind;
            return Repo.getHeadCommit().then(cmt => {
                return cmt.getTree()
            });
        }).then(tree => {
            return NodeGit.Diff.treeToIndex(Repo, tree, index);
        }).then(diff => {
            return processDiff(diff, path, commit);
        })
    }
}

function processDiff(diff, path, commit) {
    return diff.findSimilar({ renameThreshold: 50 }).then(() => {
        return diff.patches();
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
                return { path: path, paths: path.split('/'), commit: commit, hunks: result, summary: { added: linesAdded, removed: linesRemoved } };
            });
        } else {
            return Promise.reject('FILE_NOT_FOUND');
        }
    });
}

module.exports = {
    init: init,
    getStatus: getStatus,
    getFileDetail: getFileDetail,
}