const { ipcMain } = require('electron');
const { requireArgParams } = require('../infrastructure/handler-helper');
const NodeGit = require('nodegit');
var Repo;
var window = null;

ipcMain.on('Repo-Open', openRepo);
ipcMain.on('Repo-GetSubmoduleDetails', requireArgParams(getSubmoduleDetails, ['name']))

function init(win) {
    window = win;    
}

function openRepo(event, arg) {
    Repo = null;
    if (arg.workingDir) {
        NodeGit.Repository.open(arg.workingDir).then(res => {
            Repo = res;
            getSubmoduleNames();
        });
    }
}

function getSubmoduleNames(){
    if(Repo && window) {
        Repo.getSubmoduleNames().then(names => {
            let submodules = names.map(n => {
                return {
                    display: n,
                    shorthand: n,
                    submodule: true,
                }
            })
            window.webContents.send('Repo-SubmoduleNamesRetrieved', {submodules: submodules});
        })
    }
}

function getSubmoduleDetails(event, arg) {
    if(Repo && window) {
        NodeGit.Submodule.lookup(Repo, arg.name).then(submodule => {
            let result = {};
            result.hid = submodule.headId().toString();
            result.path = submodule.path();
            submodule.open().then(repo => {
                return repo.getCommit(result.hid);
            }).then(cmt => {
                result.message = cmt.message().split('\n')[0];
                result.detail = cmt.message().split('\n').splice(1, cmt.message().split('\n').length).join('\n');
                result.date = cmt.date();
                result.time = cmt.time();
                result.committer = cmt.committer();
                result.email = cmt.author().email();
                result.author = cmt.author().name();
                event.sender.send('Repo-SubmoduleDetailsRetrieved', {result: result});
            })
        })
    }
}

module.exports = {
    init: init
}