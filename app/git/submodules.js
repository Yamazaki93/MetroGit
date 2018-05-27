const { ipcMain } = require('electron');
const { requireArgParams } = require('../infrastructure/handler-helper');
const NodeGit = require('nodegit');
var Repo;
var window = null;

ipcMain.on('Repo-Open', openRepo);

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
                }
            })
            window.webContents.send('Repo-SubmoduleNamesRetrieved', {submodules: submodules});
        })
    }
}

module.exports = {
    init: init
}