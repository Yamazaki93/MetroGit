const { ipcMain } = require('electron');
const { requireArgParams } = require('../infrastructure/handler-helper');

let settings;
let window;

ipcMain.on('Settings-Init', updateRepos);
ipcMain.on('Repo-RemoveHistory', requireArgParams(removeHistory, ['workingDir']))


function updateRepos(event, arg) {
    let repos = settings.getRepos();
    let repoHistory = repos.map(r => {
        return {
            name: r.name,
            path: r.workingDir
        }
    })
    window.webContents.send('Repo-HistoryChanged', {history: repoHistory});
}

function removeHistory(event, arg) {
    settings.removeRepo(arg.workingDir);
    updateRepos();
}

function init(sett, win){
    settings = sett;
    window = win;
}

module.exports = {
    init: init,
    updateRepos: updateRepos
}