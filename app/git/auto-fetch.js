const { ipcMain } = require('electron');
var window = null;
var settings = null;
var autoFetchInterval = 1;
var autoFetch = null;

ipcMain.on('Settings-Set', (event, arg) => {
    if(arg.app_settings && arg.app_settings['gen-autofetchinterval'] !== undefined){
        autoFetchInterval = Number(arg.app_settings['gen-autofetchinterval']);
        registerAutoFetch();   
    }
});

function init(win, stt) {
    window = win;
    settings = stt;

    window.on('close', (event) => {
        clearInterval(autoFetch);
    })

    initAutoFetchSettings();
    registerAutoFetch();
}

function initAutoFetchSettings(){
    if(!settings.get('gen-autofetchinterval')){
        settings.update('gen-autofetchinterval', autoFetchInterval);
    } else {
        autoFetchInterval = Number(settings.get('gen-autofetchinterval'));
    }
}

function registerAutoFetch() {
    UnregisterAutoFetch()
    if (autoFetchInterval > 0) {
        autoFetch = setInterval(() => {
            if(window) {
                window.webContents.send('AutoFetch-Timeout');
            }
        }, autoFetchInterval * 60 * 1000);
    }
}

function UnregisterAutoFetch() {
    if (autoFetch) {
        clearInterval(autoFetch);
    }
}

module.exports = {
    init: init,
}