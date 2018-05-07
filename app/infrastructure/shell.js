const { shell, ipcMain } = require('electron');

ipcMain.on('Shell-Open', (event, arg) => {
    openUrl(arg.url);
});

function init() {

}

function openUrl(url) {
    shell.openExternal(url);
}

module.exports = {
    init: init
}