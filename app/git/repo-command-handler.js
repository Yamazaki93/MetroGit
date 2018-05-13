const { ipcMain, dialog } = require('electron');
const helper = require('./repo-helpers')
const { requireArgParams } = require('../infrastructure/handler-helper');
var repoService = null;
var settings = null;
var secure = null;

ipcMain.on('Repo-Open', requireArgParams(openRepo, ['workingDir']));
ipcMain.on('Repo-Browse', openBrowseFolderDialog);
ipcMain.on('Repo-Fetch', requireArgParams(fetchRepo, ['username', 'password']));
ipcMain.on('Repo-SetCred', requireArgParams(setCredentials, ['username', 'password']));
ipcMain.on('Repo-Pull', requireArgParams(pull, ['username', 'password', 'option']));
ipcMain.on('Repo-Push', requireArgParams(push, ['username', 'password']));
ipcMain.on('Repo-GetCommit', requireArgParams(getCommit, ['commit']));
ipcMain.on('Repo-Stage', requireArgParams(stage, ['paths']));
ipcMain.on('Repo-Unstage', requireArgParams(unstage, ['paths']));
ipcMain.on('Repo-CommitStaged', requireArgParams(commitStaged, ['name', 'email', 'message']));
ipcMain.on('Repo-Commit', requireArgParams(commit, ['name', 'email', 'message', 'files']));
ipcMain.on('Repo-Stash', requireArgParams(stash, ['name', 'email', 'message']));
ipcMain.on('Repo-Pop', pop);
ipcMain.on('Repo-Apply', apply);
ipcMain.on('Repo-CreateBranch', requireArgParams(createBranch, ['name', 'commit']));
ipcMain.on('Repo-Checkout', requireArgParams(checkout, ['branch']));
ipcMain.on('Repo-DiscardAll', discardAll);
ipcMain.on('Repo-ResetHard', requireArgParams(resetHard, ['commit']));
ipcMain.on('Repo-ResetSoft', requireArgParams(resetSoft, ['commit']));
ipcMain.on('Repo-DeleteStash', requireArgParams(deleteStash, ['index']));
ipcMain.on('Repo-CreateTag', requireArgParams(createTag, ['targetCommit', 'name']));
ipcMain.on('Repo-PushTag', requireArgParams(pushTag, ['username', 'password', 'name']));

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
    repoService.openRepo(arg.workingDir).then(() => {
        getStoredCredentials(event);
    }).catch(function (err) {
        event.sender.send('Repo-OpenFailed', { error: 'OPEN_ERROR', detail_message: err })
    });
}

function setCredentials(event, arg) {
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
    repoService.stage(arg.paths).then(res => {

    }).catch(err => {
        operationFailed('Repo-StageFail', event, err);
    });
}

function unstage(event, arg) {
    repoService.unstage(arg.paths).then(res => {

    }).catch(err => {
        operationFailed('Repo-UnstageFail', event, err);
    });
}

function commitStaged(event, arg) {
    repoService.commitStaged(arg.name, arg.email, arg.message).then(res => {
        event.sender.send('Repo-Committed', { sha: res });
    }).catch(err => {
        operationFailed('Repo-CommitFail', event, err);
    });
}

function commit(event, arg) {
    repoService.commit(arg.name, arg.email, arg.message, arg.files).then(res => {
        event.sender.send('Repo-Committed', { sha: res });
    }).catch(err => {
        operationFailed('Repo-CommitFail', event, err);
    });
}

function stash(event, arg) {
    repoService.stash(arg.name, arg.email, arg.message).then(res => {
        event.sender.send('Repo-Stashed', {});
    }).catch(err => {
        operationFailed('Repo-StashFailed', event, err);
    });
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
function apply(event, arg) {
    repoService.apply(arg.index).then(res => {
        event.sender.send('Repo-Applied', {});
    }).catch(err => {
        operationFailed('Repo-ApplyFailed', event, err);
    });
}

function createBranch(event, arg) {
    repoService.createBranch(arg.name, arg.commit, arg.force).then(res => {
        event.sender.send('Repo-BranchCreated', {});
    }).catch(err => {
        operationFailed('Repo-BranchCreateFailed', event, err);
    });
}

function checkout(event, arg) {
    repoService.checkout(arg.branch).then(res => {
        event.sender.send('Repo-Checkedout', {});
    }).catch(err => {
        operationFailed('Repo-CheckoutFailed', event, err);
    });
}

function discardAll(event, arg) {
    repoService.discardAll().then(res => {
        event.sender.send('Repo-Discarded', {});
    }).catch(err => {
        operationFailed('Repo-DiscardFailed', event, err);
    });
}

function resetHard(event, arg) {
    repoService.resetHard(arg.commit).then(res => {
        event.sender.send('Repo-Resetted', {});
    }).catch(err => {
        operationFailed('Repo-ResetFailed', event, err);
    });
}

function resetSoft(event, arg) {
    repoService.resetSoft(arg.commit).then(res => {
        event.sender.send('Repo-Resetted', {});
    }).catch(err => {
        operationFailed('Repo-ResetFailed', event, err);
    });
}

function deleteStash(event, arg) {
    repoService.deleteStash(arg.index).then(res => {
        event.sender.send('Repo-StashDeleted', {});
    }).catch(err => {
        operationFailed('Repo-DeleteStashFailed', event, err);
    });
}

function createTag(event, arg) {
    repoService.createTag(arg.targetCommit, arg.name).then(res => {
        event.sender.send('Repo-TagCreated', { name: arg.name });
    }).catch(err => {
        operationFailed('Repo-CreateTagFailed', event, err);
    });
}

function pushTag(event, arg) {
    repoService.pushTag(arg.username, arg.password, arg.name).then(res => {
        event.sender.send('Repo-TagPushed', { name: arg.name });
    }).catch(err => {
        operationFailed('Repo-PushTagFailed', event, err);
    });
}

module.exports = {
    init: init
}