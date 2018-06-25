const { ipcMain } = require('electron');

let settings;
let window;

ipcMain.on('Repo-Open', openRepo);

function openRepo() {
    let repos = settings.getRepos();
    let repoHistory = repos.map(r => {
        return {
            name: r.name,
            path: r.workingDir
        }
    })
    window.webContents.send('Repo-HistoryChanged', {history: repoHistory});
}

function init(sett, win){
    settings = sett;
    window = win;
}

module.exports = {
    init: init
}