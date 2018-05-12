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
        //win.setMenu(null);
        let address = url.format({
            pathname:  path.join(__dirname, '../frontend/dist/index.html'),
            hash: `/file/${arg.commit}`,
            protocol: 'file:',
            slashes: true,
        });
        win.webContents.once('did-finish-load', () => {
            fileWatch.getFileDetail(arg.file, arg.commit).then(result => {
                win.webContents.send('Repo-FileDetailRetrieved', result);
            })
        })
        win.loadURL(address);
        win.maximize();

    }
}

module.exports = {
    init: init,
}