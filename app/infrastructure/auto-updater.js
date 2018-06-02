const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');
var window;
var settings;

autoUpdater.autoDownload = false;

ipcMain.on('Updater', (event, arg) => {
    if (arg === 'commence-install-update') {
        settings.update('show-release-note', false);
        setImmediate(() => autoUpdater.quitAndInstall());
    } else if (arg === 'commence-download') {
        autoUpdater.downloadUpdate();
    }
});
ipcMain.on('Updater-Check', (event, arg) => {
    checkUpdate();
})
autoUpdater.on('update-available', info => {
    window.webContents.send('Updater-Checking', {inProgress: false});
    window.webContents.send('Updater', {msg: 'update-available', version: info.version });
});
autoUpdater.on('update-not-available', () => {
    window.webContents.send('Updater-Checking', {inProgress: false});
    window.webContents.send('Updater', {msg: 'update-not-available'});
});
autoUpdater.on('download-progress', (progress) => {
    window.webContents.send('Updater', {msg: 'downloading-update', percentage: progress.percent});
});
autoUpdater.on('update-downloaded', () => {
    window.webContents.send('Updater', {msg: 'download-complete'});
});
autoUpdater.on('checking-for-update', () => {
    window.webContents.send('Updater-Checking', {inProgress: true});
});


function init(win, sett) {
    window = win;
    settings = sett;
    // auto check update 30 secs after init
    setTimeout(() => {
        checkUpdate();
    }, 30 * 1000);
}

function checkUpdate() {
    if(window) {
        autoUpdater.checkForUpdates();
    }
}

module.exports = {
    init: init
}