const keytar = require('keytar');
const app = 'MetroGit'
const { ipcMain } = require('electron');
var window = null;

ipcMain.on('Secure-ClearCache', (event, arg) => {
    clearCache().then(() => {
        event.sender.send('Secure-CacheCleared');
    });
})

function init(win) {
    window = win;
}

function getPass(account) {
    return keytar.getPassword(app, account).then(result => {
        if (!result) {
            return "";
        } else {
            return result;
        }
    });
}

function setPass(account, password) {
    if (account && password) {
        return keytar.setPassword(app, account, password).catch(err => {
            window.webContents.send('Secure-SetPasswordFailed', { error: 'GENERIC', detail: err });
        });
    }
}

function clearCache() {
    return keytar.findCredentials(app).then(creds => {
        let reqs = [];
        creds.forEach((c) => {
            reqs.push(keytar.deletePassword(app, c.account));
        });
        return Promise.all(reqs);
    }).catch(err => {
        window.webContents.send('Secure-ClearCacheFailed', { error: 'GENERIC', detail: err });
    });
}

function clearRepoCache(repoID) {
    return keytar.findCredentials(app).then(creds => {
        let reqs = [];
        creds.forEach((c) => {
            if(c.indexOf(repoID) !== -1) {
                reqs.push(keytar.deletePassword(app, c.account));
            }
        });
        return Promise.all(reqs);
    })
}

module.exports = {
    getPass: getPass,
    setPass: setPass,
    init: init,
    clearCache: clearCache,
    clearRepoCache: clearRepoCache,
}