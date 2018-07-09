const { ipcMain, dialog } = require('electron');
const NodeGit = require('nodegit');
const helper = require('./repo-helpers');
var Repo = null;
var window = null;
var settings = null;
var repoHistory = null;
var refreshInterval = null;

function init(win, sett, history, fw) {
    window = win;
    settings = sett;
    repoHistory = history;
    fileWatch = fw;
    initPullOptions();
    window.on('close', (event) => {
        clearInterval(refreshInterval);
    })
}

function consolidateAuthError(err) {
    if (err.message.indexOf('credentials') !== -1 || err.message.indexOf('authentication') !== -1 || err.message.indexOf('401') !== -1) {
        return Promise.reject('CRED_ISSUE');
    } else {
        return Promise.reject(err);
    }
}

function initPullOptions() {
    if (!settings.get('gen-pulloption')) {
        settings.update('gen-pulloption', 'ffonly');
    }
}

function fetchRepo(username, password) {
    return checkSSHKey().then(() => {
        return getCurrentFirstRemote()
    }).then(remote => {
        return tryFetch(remote, 1, username, password);
    }).then(() => {
        refreshRepo();
    })
}

function getCurrentFirstRemote() {
    return getCurrentRemotes().then(remotes => {
        if (remotes.length > 0) {
            return remotes[0]
        } else {
            return Promise.reject('NO_REMOTE');
        }
    })
}

function findMatchingRemote(currentBranch, inhibitError = false) {
    return NodeGit.Branch.upstream(currentBranch).catch(err => {
        if (inhibitError) {
            return Promise.resolve(undefined);
        } else {
            return Promise.reject('UPSTREAM_NOT_FOUND');
        }
    })
}

function tryFetch(remote, tries, username, password) {
    return Repo.fetch(remote, {
        callbacks: {
            credentials: function (url, userName) {
                if (tries > 0) {
                    tries -= 1;
                    if (!helper.isSSH(url)) {
                        if (!username || !password) {
                            window.webContents.send('Repo-CredentialIssue', {});
                            return NodeGit.Cred.defaultNew();
                        }
                        return NodeGit.Cred.userpassPlaintextNew(username, password);
                    } else {
                        return NodeGit.Cred.sshKeyMemoryNew(userName, settings.publicKey(), settings.privateKey(), password)
                    }
                }
                window.webContents.send('Repo-CredentialIssue', {});
                return NodeGit.Cred.defaultNew();
            },
            certificateCheck: function () {
                return 1;
            }
        }
    }).catch(err => {
        return consolidateAuthError(err);
    });
}

function tryPush(remote, refs, tries, username, password) {
    return remote.push(refs, {
        callbacks: {
            credentials: function (url, userName) {
                if (tries > 0) {
                    tries -= 1;
                    if (!helper.isSSH(url)) {
                        if (!username || !password) {
                            window.webContents.send('Repo-CredentialIssue', {});
                            return NodeGit.Cred.defaultNew();
                        }
                        return NodeGit.Cred.userpassPlaintextNew(username, password);
                    } else {
                        return NodeGit.Cred.sshKeyMemoryNew(userName, settings.publicKey(), settings.privateKey(), password)
                    }
                }
                window.webContents.send('Repo-CredentialIssue', {});
                return NodeGit.Cred.defaultNew();
            },
            certificateCheck: function () {
                return 1;
            },
            // pending refactor 
            // pushUpdateReference: function (ref, status, data) {
            //     if (status.indexOf('declined') >= 0) {
            //         e = new Error(status);
            //     }
            // }
        }
    }).catch(err => {
        return consolidateAuthError(err);
    });
}

function pullFFOnly(remoteBranch, currentBranch) {
    return NodeGit.Graph.aheadBehind(Repo, currentBranch.target(), remoteBranch.target()).then(result => {
        if (result.ahead && result.behind) {
            return Promise.reject('LOCAL_AHEAD');
        } else if (!result.behind) {
            return Promise.resolve('UP_TO_DATE')
        } else {
            return Repo.mergeBranches(currentBranch, remoteBranch, getCurrentSignature(), NodeGit.Merge.PREFERENCE.FASTFORWARD_ONLY);
        }
    });
}

function pullRebase(remoteBranch, currentBranch) {
    return Repo.rebaseBranches(currentBranch, remoteBranch);
}

function getCurrentSignature() {
    let name = settings.get('profile-name');
    let email = settings.get('profile-email');
    let signature;
    if (!name || !email) {
        signature = NodeGit.Signature.default(Repo);
    } else {
        signature = NodeGit.Signature.now(name, email);
    }
    return signature;
}


function pullMerge(remoteBranch, currentBranch) {
    return Repo.mergeBranches(currentBranch, remoteBranch, getCurrentSignature(), NodeGit.Merge.PREFERENCE.NONE).then(res => {
        return Repo.getCommit(res);
    }).then(cmt => {
        return NodeGit.Reset.reset(Repo, cmt, NodeGit.Reset.TYPE.HARD);
    });
}

function pullWrapper(username, password, option) {
    let currentBranch;
    let remoteBranch;
    let stashed = false;
    return checkSSHKey().then(() => {
        return getCurrentFirstRemote()
    }).then(remote => {
        return tryFetch(remote, 1, username, password);
    }).then(() => {
        return Repo.getCurrentBranch();
    }).then(res => {
        currentBranch = res;
        return findMatchingRemote(res);
    }).then(rmt => {
        remoteBranch = rmt;
        notifyBlockingOperation(true);
        return Repo.getStatus().then((statuses) => {
            paths = statuses.map(s => s.path());
            if (paths.length === 0) {
                return Promise.resolve('NO_WIP')
            } else {
                updateBlockingStatus("Stashing...");
                return stage(paths).then(() => {
                    stashed = true;
                    return NodeGit.Stash.save(Repo, getCurrentSignature(), "Auto Stash", NodeGit.Stash.FLAGS.DEFAULT);
                })
            }
        })
    }).then(() => {
        updateBlockingStatus("Updating branch...");
        if (option === 'ffonly') {
            return pullFFOnly(remoteBranch, currentBranch);
        } else if (option === 'merge') {
            return pullMerge(remoteBranch, currentBranch);
        } else if (option === 'rebase') {
            return pullRebase(remoteBranch, currentBranch);
        }
    }).then(result => {
        if (stashed) {
            updateBlockingStatus('Popping stashed changes...')
            return NodeGit.Stash.pop(Repo, 0, NodeGit.Stash.APPLY_FLAGS.APPLY_DEFAULT).then(() => {
                return result;
            });
        } else {
            return result;
        }
    }).then(result => {
        refreshRepo();
        return result;
    }).finally(() => {
        notifyBlockingOperation(false);
    });
}

function pushWrapper(username, password, force) {
    let currentBranch;
    let remoteBranch;
    let firstRemote;
    let originalTarget;
    return checkSSHKey().then(() => {
        return getCurrentFirstRemote()
    }).then(remote => {
        firstRemote = remote;
        return tryFetch(remote, 1, username, password);
    }).then(() => {
        return Repo.getCurrentBranch();
    }).then(res => {
        currentBranch = res;
        return findMatchingRemote(currentBranch, true)
    }).then(rmt => {
        remoteBranch = rmt;
        originalTarget = remoteBranch.target().toString();
        return checkRemoteRefState(currentBranch, remoteBranch, force);
    }).then(() => {
        return push(firstRemote, remoteBranch, currentBranch, username, password, force).then(newRemote => {
            // checking if after push the target stays the same as original target
            // if yes, then push was rejected somehow by remote
            if (newRemote.target().toString() === originalTarget) {
                return Promise.reject('REMOTE_UNCHANGED');
            }
        });
    }).then(() => {
        notifyBlockingOperation(false);
        refreshRepo();
    }).catch(err => {
        notifyBlockingOperation(false);
        return Promise.reject(err);
    });
}

function push(firstRemote, remoteBranch, currentBranch, username, password, force) {
    notifyBlockingOperation(true, "Pushing...");
    let pushedRemote = remoteBranch === undefined ? currentBranch : remoteBranch;
    let ref;
    if (force) {
        // force push by adding a plus sign
        ref = `+${currentBranch.name()}:refs/heads/${pushedRemote.shorthand().replace(`${firstRemote.name()}/`, '')}`
    } else {
        ref = `${currentBranch.name()}:refs/heads/${pushedRemote.shorthand().replace(`${firstRemote.name()}/`, '')}`
    }
    return tryPush(firstRemote, [ref], 1, username, password).then(() => {
        return tryFetch(firstRemote, 1, username, password);
    }).then(() => {
        // setting upstream automatically
        if (!remoteBranch) {
            return NodeGit.Branch.setUpstream(currentBranch, firstRemote.name() + '/' + pushedRemote.shorthand()).then(() => {
                return NodeGit.Branch.upstream(currentBranch);
            })
        } else {
            return NodeGit.Branch.upstream(currentBranch);
        }
    });
}

function checkRemoteRefState(currentBranch, remoteBranch, force) {
    if (!remoteBranch) {
        return Promise.resolve()
    }
    return NodeGit.Graph.aheadBehind(Repo, remoteBranch.target(), currentBranch.target()).then(result => {
        if (result.ahead && !force) {
            return Promise.reject('FORCE_REQUIRED');
        } else if (!result.behind && !result.ahead) {
            return Promise.reject('UP_TO_DATE');
        } else {
            return Promise.resolve();
        }
    });
}

function getCommits() {
    if (Repo && window) {
        let walker = NodeGit.Revwalk.create(Repo);
        walker.sorting(NodeGit.Revwalk.SORT.TOPOLOGICAL, NodeGit.Revwalk.SORT.TIME);
        walker.pushGlob('*');
        let stashes = [];
        return NodeGit.Stash.foreach(Repo, (index, msg, id) => {
            stashes.push(id.toString());
            walker.push(id);
        }).then(() => {
            return walker.getCommits(500).then(res => {
                let commits = [];
                let stashIndicies = [];
                res.forEach(x => {
                    let stashIndex = -1;
                    let isStash = false;
                    let parents = x.parents().map(p => p.toString());
                    if (stashes.indexOf(x.sha()) !== -1) {
                        isStash = true;
                        parents = [x.parents()[0].toString()];
                        if (x.parents().length > 0) {
                            for (let i = 1; i < x.parents().length; i++) {
                                stashIndicies.push(x.parents()[i].toString());
                            }
                        }
                        stashIndex = stashes.indexOf(x.sha());
                    }
                    let cmt = {
                        sha: x.sha(),
                        message: x.message().split('\n')[0],
                        detail: x.message().split('\n').splice(1, x.message().split('\n').length).join('\n'),
                        date: x.date(),
                        time: x.time(),
                        committer: x.committer(),
                        email: x.author().email(),
                        author: x.author().name(),
                        parents: parents,
                        isStash: isStash,
                        stashIndex: stashIndex,
                    }
                    if (stashIndicies.indexOf(cmt.sha) === -1) {
                        commits.push(cmt);
                    }
                });
                return commits;
            }).then(result => {
                window.webContents.send('Repo-CommitsUpdated', { newCommits: result });
                return result;
            });
        })
    } else {
        return Promise.reject('NO_REPO')
    }
}

function getCommitDetails(sha) {
    return Repo.getCommit(sha).then(x => {
        return x.getDiff().then(diffs => {
            diff = diffs[0]
            return diff.findSimilar({ renameThreshold: 50 }).then(() => {
                return diff.patches();
            });
        }).then(patches => {
            let modified = 0;
            let added = 0;
            let deleted = 0;
            let renamed = 0;
            let files = [];
            patches.forEach(p => {
                let existingPaths = files.map(f => f.path);
                if (existingPaths.indexOf(p.newFile().path()) === -1) {
                    if (p.isRenamed()) {
                        renamed += 1;
                    } else if (p.isModified()) {
                        modified += 1;
                    } else if (p.isDeleted()) {
                        deleted += 1;
                    } else if (p.isAdded()) {
                        added += 1;
                    }
                    files.push({
                        isModified: p.isModified(),
                        isAdded: p.isAdded(),
                        isDeleted: p.isDeleted(),
                        isRenamed: p.isRenamed(),
                        path: p.newFile().path()
                    })
                }
            });
            return {
                sha: x.sha(),
                message: x.message().split('\n')[0],
                detail: x.message().split('\n').splice(1, x.message().split('\n').length).join('\n'),
                date: x.date(),
                time: x.time(),
                committer: x.committer(),
                email: x.author().email(),
                author: x.author().name(),
                parents: x.parents().map(p => p.toString()),
                fileSummary: {
                    added: added,
                    deleted: deleted,
                    modified: modified,
                    renamed: renamed,
                },
                files: files
            }
        });
    });
}

function getReferences() {
    if (Repo && window) {
        return Repo.getReferences(NodeGit.Reference.TYPE.LISTALL).then(refs => {
            refs = refs.filter(_ => _.shorthand() !== 'stash');
            let remoteRefs = refs.filter(_ => _.isRemote());
            let localRefs = refs.filter(_ => _.isBranch());
            localRefs.forEach(localR => {
                let matching = remoteRefs.filter(ref => ref.shorthand().indexOf(localR.shorthand()) !== -1);
                if (matching.length) {
                    localR.diff = localR.cmp(matching[0]);
                }
            })

            let references = refs.map(ref => {
                display = "";
                if (ref.isBranch()) {
                    display = ref.shorthand();
                } else if (ref.isRemote()) {
                    let names = ref.shorthand().split('/');
                    display = names.splice(1, names.length).join('/');
                } else if (ref.isTag()) {
                    display = ref.shorthand();
                }
                return {
                    target: ref.target().toString(),
                    isBranch: ref.isBranch(),
                    isRemote: ref.isRemote(),
                    isTag: ref.isTag(),
                    name: ref.name(),
                    shorthand: ref.shorthand(),
                    display: display
                }
            });
            let refDict = {};
            references.forEach(ref => {
                if (refDict[ref.target]) {
                    refDict[ref.target].push(ref);
                } else {
                    refDict[ref.target] = [ref];
                }
            })
            window.webContents.send('Repo-RefRetrieved', { references: references, refDict: refDict });
            return { references: references, refDict: refDict };
        })
    } else {
        return Promise.reject('NO_REPO');
    }
}

function refreshRepo() {
    if (Repo) {
        let req = [getCommits(),
        getCurrentBranch(),
        getReferences(),
        updateCurrentBranchPosition()];
        return Promise.all(req);
    } else {
        return Promise.resolve();
    }
}

function notifyBlockingOperation(start, op) {
    if (window) {
        if (start) {
            window.webContents.send('Repo-BlockingOperationBegan', { operation: op });
        } else {
            window.webContents.send('Repo-BlockingOperationEnd', {});
        }
    }
}

function updateBlockingStatus(op) {
    if (window) {
        window.webContents.send('Repo-BlockingUpdate', { operation: op });
    }
}

function openRepo(workingDir) {
    let repoName;
    return NodeGit.Repository.open(workingDir).then(res => {
        Repo = res;
        let paths = workingDir.split(require('path').sep);
        repoName = paths[paths.length - 1];
        window.webContents.send('Repo-OpenSuccessful', { repoName: repoName, workingDir: workingDir });
        settings.setRepo(workingDir, repoName);
        repoHistory.updateRepos();
        checkSSHKey();
        getCurrentRemotes().then(remotes => {
            if (remotes.length > 0) {
                let url = remotes[0].url();
                window.webContents.send('Repo-RemotesChanged', { remote: url });
            }
        });
        clearInterval(refreshInterval);
        refreshInterval = setInterval(() => {
            refreshRepo();
        }, 10 * 1000);
        return refreshRepo();
    });
}

function checkSSHKey() {
    if (window) {
        return getCurrentRemotes().then(remotes => {
            if (remotes.length > 0) {
                let url = remotes[0].url();
                if (helper.isSSH(url) && (!settings.get('auth-pubpath') || !settings.get('auth-keypath'))) {
                    window.webContents.send('Repo-SSHKeyRequired', {});
                    return Promise.reject('SSH_KEY_REQUIRED');
                } else {
                    return Promise.resolve();
                }
            } else {
                return Promise.reject('NO_REMOTE');
            }
        });
    } else {
        return Promise.reject('NO_REPO')
    }
}

function updateCurrentBranchPosition() {
    if (Repo) {
        let currentBranch;
        let remoteBranch;
        return Repo.getCurrentBranch().then(res => {
            currentBranch = res;
            return findMatchingRemote(res);
        }).then(rmt => {
            remoteBranch = rmt;
            return NodeGit.Graph.aheadBehind(Repo, currentBranch.target(), remoteBranch.target());
        }).then(result => {
            window.webContents.send('Repo-BranchPositionRetrieved', result);
        }).catch(err => {
            if (err !== 'UPSTREAM_NOT_FOUND') {
                return Promise.reject(err);
            } else {
                return Promise.resolve();
            }
        });
    }
}

function getCurrentBranch() {
    if (window) {
        return Repo.getCurrentBranch().then(ref => {
            let branchNames = ref.name().split('/');
            let branchName = branchNames[branchNames.length - 1];
            window.webContents.send('Repo-BranchChanged', { name: branchName, fullName: ref.name(), shorthand: ref.shorthand(), target: ref.target().toString() });
        });
    }
}

function getCurrentRemotes() {
    return Repo.getRemotes().then(strs => {
        let reqs = [];
        strs.forEach(r => {
            reqs.push(Repo.getRemote(r));
        });
        return Promise.all(reqs);
    })
}

function stage(paths) {
    let statuses;
    return Repo.getStatus().then((sts) => {
        statuses = sts;
        return Repo.refreshIndex()
    }).then(index => {
        let req = [];
        statuses.forEach(st => {
            if (paths.indexOf(st.path()) !== -1 || paths.length === 0) {
                if (st.isDeleted()) {
                    req.push(index.removeByPath(st.path()));
                } else {
                    req.push(index.addByPath(st.path()));
                }
            }
        });
        return Promise.all(req).then(() => {
            return index.write();
        });
    }).then(() => {
        return fileWatch.getStatus();
    });
}

// requestedLines: [{oldLineno, newLineno}]
function stageLines(path, requestedLines) {
    return NodeGit.Diff.indexToWorkdir(Repo, null, {
        flags: NodeGit.Diff.OPTION.SHOW_UNTRACKED_CONTENT | NodeGit.Diff.OPTION.RECURSE_UNTRACKED_DIRS
    }).then(diff => {
        return getAllHunkLinesInDiff(diff, path);
    }).then(hunkLines => {
        let stageHunkLines = [];
        requestedLines.forEach(l => {
            hunkLines.forEach(hl => {
                if(hl.newLineno() === l.newLineno && hl.oldLineno() === l.oldLineno){
                    stageHunkLines.push(hl);
                }
            })
        })
        return Repo.stageLines(path, stageHunkLines, false);
    });
}

function unstageLines(path, requestedLines) {
    let index;
    return Repo.index().then(ind => {
        index = ind;
        return Repo.getHeadCommit().then(cmt => {
            return cmt.getTree();
        });
    }).then(tree => {
        return NodeGit.Diff.treeToIndex(Repo, tree, index);
    }).then(diff => {
        return getAllHunkLinesInDiff(diff, path);
    }).then(hunkLines => {
        let unstageHunkLines = [];
        requestedLines.forEach(l => {
            hunkLines.forEach(hl => {
                if(hl.newLineno() === l.newLineno && hl.oldLineno() === l.oldLineno){
                    unstageHunkLines.push(hl);
                }
            });
        });
        return Repo.stageLines(path, unstageHunkLines, true);
    })
}

function getAllHunkLinesInDiff(diff, path) {
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
            })
        } else {
            return Promise.reject('FILE_NOT_FOUND')
        }
    }).then(hunks => {
        let hunkLines = [];
        hunks.forEach(lines => {
            lines.forEach(function (line) {
                hunkLines.push(line);
            });
        });
        return hunkLines;
    })
}

function unstage(paths) {
    return Repo.getHeadCommit().then(commit => {
        return NodeGit.Reset.default(Repo, commit, paths);
    }).then(() => {
        return fileWatch.getStatus();
    });
}

function commitStaged(name, email, message) {
    if (name && email) {
        let signature = NodeGit.Signature.now(name, email);
        let oid;
        let sha;
        return Repo.refreshIndex().then(() => {
            return Repo.index()
        }).then(index => {
            return index.write().then(() => {
                return index.writeTree();
            });
        }).then(id => {
            oid = id;
            return Repo.getCurrentBranch()
        }).then(ref => {
            notifyBlockingOperation(true, "Commiting...");
            return Repo.createCommit("HEAD", signature, signature, message, oid, [ref.target()]);
        }).then(hash => {
            sha = hash;
            return Promise.all([refreshRepo(), fileWatch.getStatus()]);
        }).then(() => {
            notifyBlockingOperation(false);
            return sha;
        }).catch(err => {
            notifyBlockingOperation(false);
            return Promise.reject(err);
        });
    }
}

function commit(name, email, message, files) {
    if (name && email) {
        return stage(files).then(() => {
            return Repo.index().then(index => {
                index.writeTree();
            });
        }).then(() => {
            return commitStaged(name, email, message)
        });
    }
}

function stash(name, email, message) {
    let signature;
    if (!name || !email) {
        signature = getCurrentSignature();
    } else {
        signature = NodeGit.Signature.now(name, email);
    }
    let sha;
    let paths = [];
    notifyBlockingOperation(true, "Stashing...");
    return Repo.getStatus().then((statuses) => {
        paths = statuses.map(s => s.path());
        if (paths.length === 0) {
            return Promise.resolve('NO_WIP')
        } else {
            return stage(paths).then(() => {
                return NodeGit.Stash.save(Repo, signature, message, NodeGit.Stash.FLAGS.INCLUDE_UNTRACKED);
            })
        }
    }).finally(oid => {
        notifyBlockingOperation(false);
        return Promise.all([refreshRepo(), fileWatch.getStatus()]);
    })
}

function pop(index) {
    if (index < 0) {
        index = 0;
    }
    notifyBlockingOperation(true, "Popping Stash...");
    return Repo.refreshIndex().then(() => {
        return NodeGit.Stash.pop(Repo, index, NodeGit.Stash.APPLY_FLAGS.APPLY_DEFAULT)
    }).finally(oid => {
        notifyBlockingOperation(false);
        return Promise.all([refreshRepo(), fileWatch.getStatus()]);
    })
}

function apply(index) {
    if (index < 0) {
        index = 0;
    }
    notifyBlockingOperation(true, "Applying Stash...");
    return Repo.refreshIndex().then(() => {
        return NodeGit.Stash.apply(Repo, index, NodeGit.Stash.APPLY_FLAGS.APPLY_DEFAULT)
    }).finally(oid => {
        notifyBlockingOperation(false);
        return Promise.all([refreshRepo(), fileWatch.getStatus()]);
    })
}

function deleteStash(index) {
    return NodeGit.Stash.drop(Repo, index).then(() => {
        return Promise.all([refreshRepo(), fileWatch.getStatus()]);
    });
}

function createBranch(name, commit, force) {
    if (force === undefined) {
        force = false;
    }
    notifyBlockingOperation(true, "Creating Branch...");
    return Repo.createBranch(name, commit, force).then(ref => {
        return Repo.checkoutBranch(name)
    }).then(() => {
        return refreshRepo();
    }).finally(() => {
        notifyBlockingOperation(false);
    });
}

function checkout(branchName) {
    notifyBlockingOperation(true, "Checking Out...");
    return getCurrentFirstRemote().then(rmt => {
        let name = rmt.name();
        if (branchName.startsWith(`${name}/`)) {
            let newName = branchName.replace(`${name}/`, '')
            return Repo.getReference(branchName).then(ref => {
                let target = ref.target();
                return Repo.createBranch(newName, target, true).then(localRef => {
                    return NodeGit.Branch.setUpstream(localRef, branchName).then(() => {
                        return localRef;
                    });
                })
            })
        } else {
            return Repo.getReference(branchName);
        }
    }).then(ref => {
        return Repo.checkoutBranch(ref)
    }).then(() => {
        return refreshRepo();
    }).catch(err => {
        return Promise.reject(err);
    }).finally(res => {
        notifyBlockingOperation(false);
    })
}

function discardAll() {
    return stage([]).then(() => {
        return Repo.getHeadCommit()
    }).then(commit => {
        return NodeGit.Reset.reset(Repo, commit, NodeGit.Reset.TYPE.HARD);
    }).then(() => {
        return fileWatch.getStatus();
    })
}

function resetHard(commit) {
    return stage([]).then(() => {
        return Repo.getCommit(commit);
    }).then(commit => {
        if (!commit) {
            return Promise.reject('COMMIT_NOT_FOUND');
        }
        notifyBlockingOperation(true, "Resetting...")
        return NodeGit.Reset.reset(Repo, commit, NodeGit.Reset.TYPE.HARD);
    }).then(() => {
        notifyBlockingOperation(false);
        return Promise.all([refreshRepo(), fileWatch.getStatus()]);
    })
}

function resetSoft(commit) {
    return stage([]).then(() => {
        return Repo.getCommit(commit);
    }).then(commit => {
        if (!commit) {
            return Promise.reject('COMMIT_NOT_FOUND');
        }
        notifyBlockingOperation(true, "Resetting...")
        return NodeGit.Reset.reset(Repo, commit, NodeGit.Reset.TYPE.SOFT);
    }).then(() => {
        notifyBlockingOperation(false);
        return Promise.all([refreshRepo(), fileWatch.getStatus()]);
    })
}

function requireRepo(wrapped) {
    return function () {
        if (Repo) {
            return wrapped.apply(this, arguments);
        } else {
            return Promise.reject('NO_REPO');
        }
    }
}

function createTag(targetCommit, name) {
    return Repo.getCommit(targetCommit).then(cmt => {
        return NodeGit.Tag.createLightweight(Repo, name, cmt, 1);
    }).then(() => {
        return refreshRepo();
    });
}

function deleteTag(name) {
    return NodeGit.Tag.delete(Repo, name).then(() => {
        return refreshRepo();
    })
}

function deleteBranch(name, username, password) {
    let branch;
    return Repo.getCurrentBranch().then(ref => {
        if (ref.name() === name) {
            return Promise.reject('IS_CURRENT_BRANCH');
        }
        return Repo.getBranch(name)
    }).then(ref => {
        branch = ref;
        return ref.delete();
    }).then(res => {
        if (branch.isRemote() && username && password) {
            return getCurrentFirstRemote().then(rmt => {
                let ref = `:refs/heads/${branch.shorthand().split('/').slice(1).join('/')}`;
                return tryPush(rmt, [ref], 1, username, password)
            }).then(() => {
                return refreshRepo();
            })
        }
        return refreshRepo();
    }).then(() => {
        return findMatchingRemote(branch).then(ref => {
            if (ref) {
                return Promise.resolve({ upstream: ref.name() });
            } else {
                return Promise.resolve();
            }
        }).catch(() => {
            return Promise.resolve()
        })
    })
}

function pushTag(username, password, name, toDelete) {
    return checkSSHKey().then(() => {
        return getCurrentFirstRemote()
    }).then(remote => {
        firstRemote = remote;
        notifyBlockingOperation(true, "Updating Remote Tag...");
        // force push by adding a plus sign
        let ref = `:refs/tags/${name}`;
        if (!toDelete) {
            ref = `+refs/tags/${name}` + ref;
        }
        return tryPush(firstRemote, [ref], 1, username, password);
    }).then(() => {
        notifyBlockingOperation(false);
        refreshRepo();
    }).catch(err => {
        notifyBlockingOperation(false);
        return Promise.reject(err);
    });
}

function closeRepo() {
    Repo = undefined;
    clearInterval(refreshInterval);
    window.webContents.send('Repo-Closed', {});
}

module.exports = {
    init: init,
    openRepo: openRepo,
    fetchRepo: requireRepo(fetchRepo),
    getCurrentRemotes: requireRepo(getCurrentRemotes),
    getCurrentFirstRemote: requireRepo(getCurrentFirstRemote),
    pullWrapper: requireRepo(pullWrapper),
    push: requireRepo(pushWrapper),
    stage: requireRepo(stage),
    unstage: requireRepo(unstage),
    commitStaged: requireRepo(commitStaged),
    commit: requireRepo(commit),
    stash: requireRepo(stash),
    pop: requireRepo(pop),
    getCommitDetails: requireRepo(getCommitDetails),
    createBranch: requireRepo(createBranch),
    checkout: requireRepo(checkout),
    discardAll: requireRepo(discardAll),
    resetHard: requireRepo(resetHard),
    resetSoft: requireRepo(resetSoft),
    deleteStash: requireRepo(deleteStash),
    apply: requireRepo(apply),
    createTag: requireRepo(createTag),
    deleteTag: requireRepo(deleteTag),
    pushTag: requireRepo(pushTag),
    deleteBranch: requireRepo(deleteBranch),
    closeRepo: requireRepo(closeRepo),
    stageLines: requireRepo(stageLines),
    unstageLines: requireRepo(unstageLines),
}