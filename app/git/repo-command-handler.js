const { ipcMain, dialog } = require('electron');
const helper = require('./repo-helpers')
var repoService = null;
var settings = null;
var secure = null;

ipcMain.on('Repo-Open', openRepo);
ipcMain.on('Repo-Browse', openBrowseFolderDialog);
ipcMain.on('Repo-Fetch', fetchRepo);
ipcMain.on('Repo-SetCred', setCredentials);
ipcMain.on('Repo-Pull', pull);
ipcMain.on('Repo-Push', push);
ipcMain.on('Repo-GetCommit', getCommit);
ipcMain.on('Repo-Stage', stage);
ipcMain.on('Repo-Unstage', unstage);
ipcMain.on('Repo-CommitStaged', commitStaged);
ipcMain.on('Repo-Commit', commit);
ipcMain.on('Repo-Stash', stash);
ipcMain.on('Repo-Pop', pop);
ipcMain.on('Repo-CreateBranch', createBranch);
ipcMain.on('Repo-Checkout', checkout);
ipcMain.on('Repo-DiscardAll', discardAll);
ipcMain.on('Repo-ResetHard', resetHard);
ipcMain.on('Repo-ResetSoft', resetSoft);
ipcMain.on('Repo-DeleteStash', deleteStash);

function init(repo, sett, sec) {
    repoService = repo;
    settings = sett;
    secure = sec;
}

function pull(event, arg) {
    repoService.pullWrapper(arg.username, arg.password, arg.option).then(result => {
        event.sender.send('Repo-Pulled', { result: result });
    }).catch(res => {
        operationFailed('Repo-PullFailed', event, res);
    });
}

function push(event, arg) {
    repoService.push(arg.username, arg.password, arg.force).then(result => {
        event.sender.send('Repo-Pushed', { result: result });
    }).catch(res => {
        operationFailed('Repo-PushFailed', event, res, res);
    });
}

function getCommit(event, arg) {
    repoService.getCommitDetails(arg.commit).then(result => {
        event.sender.send('Repo-CommitDetailRetrieved', { commit: result });
    }).catch(res => {
        operationFailed('Repo-FailedGetCommitDetail', event, res);
    });
}

function openRepo(event, arg) {
    if (!arg.workingDir) {
        event.sender.send('Repo-OpenFailed', { error: 'REQUIRE_PATH' })
    } else {
        repoService.openRepo(arg.workingDir).then(() => {
            getStoredCredentials(event);
        }).catch(function (err) {
            event.sender.send('Repo-OpenFailed', { error: 'OPEN_ERROR', detail_message: err })
        });
    }
}

function setCredentials(event, arg) {
    if (arg.password && arg.username !== undefined) {
        settings.updateRepoSetting('auth-username', arg.username);
        repoService.getCurrentFirstRemote().then(remote => {
            let url = remote.url();
            if (!helper.isSSH(url)) {
                secure.setPass(`${arg.username}@${url}`, arg.password);
            } else {
                secure.setPass(`${url}`, arg.password);
            }
        })
    }
}

function getStoredCredentials(event) {
    if (secure) {
        repoService.getCurrentFirstRemote().then(remote => {
            let url = remote.url();
            if (!helper.isSSH(url)) {
                let storedUsername = settings.get('auth-username');
                if (storedUsername) {
                    event.sender.send('Repo-UsernameRetrieved', { username: storedUsername });
                    secure.getPass(`${storedUsername}@${url}`).then(pass => {
                        event.sender.send('Repo-PasswordRetrieved', { password: pass });
                    });
                }
            } else {
                secure.getPass(`${url}`).then(pass => {
                    event.sender.send('Repo-PasswordRetrieved', { password: pass });
                });
            }
        });
    }

}

function fetchRepo(event, arg) {
    repoService.fetchRepo(arg.username, arg.password).catch(res => {
        operationFailed('Repo-FetchFailed', event, res);
    });
}

function openBrowseFolderDialog(event, arg) {
    let selectedPath = dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (selectedPath && selectedPath.length > 0) {
        event.sender.send('Repo-FolderSelected', { path: selectedPath[0] });
    }
}

function operationFailed(op, event, res, payload) {
    if (res.message) {
        res = res.message;
    }
    let obj = { error: 'OP_FAIL', detail: res };
    if (payload) {
        obj.payload = payload;
    }
    event.sender.send(op, obj);
}

function stage(event, arg) {
    if (arg.paths) {
        repoService.stage(arg.paths).then(res => {

        }).catch(err => {
            operationFailed('Repo-StageFail', event, err);
        });
    }
}

function unstage(event, arg) {
    if (arg.paths) {
        repoService.unstage(arg.paths).then(res => {

        }).catch(err => {
            operationFailed('Repo-UnstageFail', event, err);
        });
    }
}

function commitStaged(event, arg) {
    if (arg.name && arg.email && arg.message) {
        repoService.commitStaged(arg.name, arg.email, arg.message).then(res => {
            event.sender.send('Repo-Committed', { sha: res });
        }).catch(err => {
            operationFailed('Repo-CommitFail', event, err);
        });
    }
}

function commit(event, arg) {
    if (arg.name && arg.email && arg.message && arg.files) {
        repoService.commit(arg.name, arg.email, arg.message, arg.files).then(res => {
            event.sender.send('Repo-Committed', { sha: res });
        }).catch(err => {
            operationFailed('Repo-CommitFail', event, err);
        });
    }
}

function stash(event, arg) {
    if (arg.name && arg.email && arg.message) {
        repoService.stash(arg.name, arg.email, arg.message).then(res => {
            event.sender.send('Repo-Stashed', {});
        }).catch(err => {
            operationFailed('Repo-StashFailed', event, err);
        });
    }
}

function pop(event, arg) {
    repoService.pop(arg.index).then(res => {
        event.sender.send('Repo-Popped', {});
    }).catch(err => {
        if (err.errno === -3) {
            operationFailed('Repo-PopFailed', event, 'NO_STASH')
        } else {
            operationFailed('Repo-PopFailed', event, err);
        }
    });
}

function createBranch(event, arg) {
    if (arg.name && arg.commit) {
        repoService.createBranch(arg.name, arg.commit, arg.force).then(res => {
            event.sender.send('Repo-BranchCreated', {});
        }).catch(err => {
            operationFailed('Repo-BranchCreateFailed', event, err);
        });
    }
}

function checkout(event, arg) {
    if (arg.branch) {
        repoService.checkout(arg.branch).then(res => {
            event.sender.send('Repo-Checkedout', {});
        }).catch(err => {
            operationFailed('Repo-CheckoutFailed', event, err);
        });
    }
}

function discardAll(event, arg) {
    repoService.discardAll().then(res => {
        event.sender.send('Repo-Discarded', {});
    }).catch(err => {
        operationFailed('Repo-DiscardFailed', event, err);
    });
}

function resetHard(event, arg) {
    if(arg.commit) {
        repoService.resetHard(arg.commit).then(res => {
            event.sender.send('Repo-Resetted', {});
        }).catch(err => {
            operationFailed('Repo-ResetFailed', event, err);
        });
    }
}

function resetSoft(event, arg) {
    if(arg.commit) {
        repoService.resetSoft(arg.commit).then(res => {
            event.sender.send('Repo-Resetted', {});
        }).catch(err => {
            operationFailed('Repo-ResetFailed', event, err);
        });
    }
}

function deleteStash(event, arg) {
    if(arg.index !== undefined) {
        repoService.deleteStash(arg.index).then(res => {
            event.sender.send('Repo-StashDeleted', {});
        }).catch(err => {
            operationFailed('Repo-DeleteStashFailed', event, err);
        });
    }
}

module.exports = {
    init: init
}