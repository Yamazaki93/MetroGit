const { shell, ipcMain } = require('electron');

function init() {
    ipcMain.on('Shell-Open', (event, arg) => {
        openUrl(arg.url);
    });
}

function openUrl(url) {
    shell.openExternal(url);
}

module.exports = {
    init: init
}