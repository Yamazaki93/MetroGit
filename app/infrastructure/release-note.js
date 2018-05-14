const { ipcMain, BrowserWindow } = require('electron');
const { requireArgParams } = require('../infrastructure/handler-helper');
const url = require('url');
const path = require('path');
var settings;

function init(sett, win) {
    settings = sett;
    //if(!settings.get('show-release-note')) {
        settings.update('show-release-note', true);
        win.webContents.once('did-finish-load', () => {
            openReleaseNote();
        })
    //}
}

function openReleaseNote(){
    let win = new BrowserWindow({});
    win.setMenu(null);
    let address = url.format({
        pathname: path.join(__dirname, '../frontend/dist/index.html'),
        hash: `/release-note`,
        protocol: 'file:',
        slashes: true,
    });
    win.loadURL(address);
    win.maximize();
}

module.exports = {
    init: init
}