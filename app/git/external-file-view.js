const { ipcMain, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
var fileWatch;

ipcMain.on('Repo-OpenExternalFile', open);

function init(fw){
    fileWatch = fw;    
}

function open(event, arg) {
    if(arg.file && arg.commit) {
        let win = new BrowserWindow({});
        win.setMenu(null);
        win.loadURL(url.format({
            pathname:  path.join(__dirname, '../frontend/dist/index.html'),
            hash: `/file/${arg.commit}/${arg.file}`,
            protocol: 'file:',
            slashes: true,
        }))
        win.maximize();
    }
}

module.exports = {
    init: init,
}