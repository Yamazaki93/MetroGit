const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');
var window;

autoUpdater.autoDownload = false;

ipcMain.on('Updater', (event, arg) => {
    if (arg === 'commence-install-update') {
        setImmediate(() => autoUpdater.quitAndInstall());
    } else if (arg === 'commence-download') {
        autoUpdater.downloadUpdate();
    }
});
autoUpdater.on('update-available', () => {
    window.webContents.send('Updater', {msg: 'update-available'});
});
autoUpdater.on('download-progress', (progress) => {
    window.webContents.send('Updater', {msg: 'downloading-update', percentage: progress.percent});
});
autoUpdater.on('update-downloaded', () => {
    window.webContents.send('Updater', {msg: 'download-complete'});
});


function init(win) {
    window = win;
    // auto check update 30 secs after init
    setTimeout(() => {
        autoUpdater.checkForUpdates().then(res =>{
            console.log(res);
        })
    }, 30 * 1000);
}

module.exports = {
    init: init
}