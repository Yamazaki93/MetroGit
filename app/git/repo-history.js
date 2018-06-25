const { ipcMain } = require('electron');

let settings;
let window;

function init(sett, win){
    settings = sett;
    window = win;
    
}

module.exports = {
    init: init
}