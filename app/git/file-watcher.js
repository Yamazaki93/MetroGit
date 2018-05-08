const { ipcMain } = require('electron');
const NodeGit = require('nodegit');
var Repo;
var window = null;
var refreshInterval;

ipcMain.on('Repo-Open', openRepo);

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

module.exports = {
    init: init,
    getStatus: getStatus,
}