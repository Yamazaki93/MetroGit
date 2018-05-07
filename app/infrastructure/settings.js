const fs = require('fs');
const homeDir = require('os').homedir();
const appDir = homeDir + '/MetroGit/';
const uuid = require('uuid');
const { ipcMain, dialog } = require('electron');
let window;
let secureStorage;
let settingsFile;
let settingsObj = { app_settings: { langulage: 'en' }, repos: [], currentRepo: undefined };
let repoSettingsObj = {};
let privContent = "";
let publicContent = "";

ipcMain.on('Settings-Init', (event, arg) => {
    notifySettingsUpdated();
})
ipcMain.on('Settings-Set', (event, arg) => {
    if (arg.app_settings) {
        settingsObj.app_settings = arg.app_settings;
    }
    if (arg.repo_settings) {
        repoSettingsObj = arg.repo_settings;
    }
    save();
    updateSSHKey();
    notifySettingsUpdated();
});
ipcMain.on('Settings-SetSecureRepo', setSecureRepoSetting);
ipcMain.on('Settings-GetSecureRepo', getSecureRepoSetting);
ipcMain.on('Settings-BrowseFile', openBrowseFolderDialog)

let save = function () {
    fs.writeFileSync(settingsFile, JSON.stringify(settingsObj), 'utf8');
    saveRepoSettings();
}

function updateSSHKey() {
    if (get('auth-keypath') && get('auth-pubpath')) {
        publicContent = fs.readFileSync(get('auth-pubpath'), {
            encoding: "ascii"
        });
        privContent = fs.readFileSync(get('auth-keypath'), {
            encoding: "ascii"
        });
    } else {
        privContent = "";
        publicContent = "";
    }
}

function openBrowseFolderDialog(event, arg) {
    let selectedPath = dialog.showOpenDialog({ properties: ['openFile'] });
    if (selectedPath && selectedPath.length > 0) {
        event.returnValue = selectedPath[0];
    } else {
        event.returnValue = "";
    }
}
let load = function (path) {
    settingsObj = JSON.parse(fs.readFileSync(path));
    if (settingsObj.currentRepo) {
        initRepoSettings(settingsObj.currentRepo.id);
    }
    updateSSHKey();
    notifySettingsUpdated();
}

let notifySettingsUpdated = function () {
    let obj = {
        app_settings: settingsObj.app_settings,
        repo_settings: repoSettingsObj,
        current_repo: settingsObj.currentRepo
    }
    window.webContents.send('Settings-Updated', { currentSettings: obj });
    window.webContents.send('Settings-EffectiveUpdated', getEffectiveSettings());
}

let init = function (win, sec) {
    window = win;
    secureStorage = sec;
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir);
    }
    settingsFile = appDir + 'settings.json';
    if (global.__is_dev) {
        settingsFile = './settings.json'
    }
    if (!fs.existsSync(settingsFile)) {
        save();
    } else {
        load(settingsFile);
    }

}

function setSecureRepoSetting(event, arg) {
    if(arg.key && arg.value && settingsObj.currentRepo){
        secureStorage.setPass(`${arg.key}@${settingsObj.currentRepo.id}`, arg.value)
    }
}

function getSecureRepoSetting(event, arg){
    if(arg.key && settingsObj.currentRepo){
        secureStorage.getPass(`${arg.key}@${settingsObj.currentRepo.id}`).then(value => {
            if(!value) {
                value = "";
            }
            event.returnValue = value;
        });
    }
}

let setRepo = function (workingDir, name) {
    settingsObj.currentRepo = settingsObj.repos.find(r => r.workingDir === workingDir);
    if (!settingsObj.currentRepo) {
        let newID = uuid.v4();
        settingsObj.currentRepo = { name: name, workingDir: workingDir, id: newID };
        settingsObj.repos.push(settingsObj.currentRepo);
    }
    initRepoSettings(settingsObj.currentRepo.id);
    save();
    notifySettingsUpdated();
}

let getEffectiveSettings = function () {
    let appKeys = Object.keys(settingsObj.app_settings);
    let repoKeys = Object.keys(repoSettingsObj);
    let effective = {};
    let allKeys = union_arrays(appKeys, repoKeys);
    allKeys.forEach(function (k) {
        effective[k] = get(k);
    });
    effective['currentRepo'] = settingsObj.currentRepo;
    return effective;
}

function union_arrays(x, y) {
    var obj = {};
    for (var i = x.length - 1; i >= 0; --i)
        obj[x[i]] = x[i];
    for (var i = y.length - 1; i >= 0; --i)
        obj[y[i]] = y[i];
    var res = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k))  // <-- optional
            res.push(obj[k]);
    }
    return res;
}

let initRepoSettings = function (repo) {
    let settingsFile = appDir + repo + '.json';
    if (fs.existsSync(settingsFile)) {
        repoSettingsObj = JSON.parse(fs.readFileSync(settingsFile));
    } else {
        repoSettingsObj = {};
        fs.writeFileSync(settingsFile, JSON.stringify(repoSettingsObj), 'utf8')
    }
}

let saveRepoSettings = function () {
    if (settingsObj.currentRepo && settingsObj.currentRepo.id !== "") {
        let settingsFile = appDir + settingsObj.currentRepo.id + '.json';
        fs.writeFileSync(settingsFile, JSON.stringify(repoSettingsObj), 'utf8')
    }
}

let update = function (key, value) {
    if (key === 'repos' || key === 'currentRepo') {
        // guard internal settings
        return;
    }
    settingsObj.app_settings[key] = value;
    save();
}

let updateRepoSetting = function (key, value) {
    if (key === 'repos' || key === 'currentRepo') {
        // guard internal settings
        return;
    }
    repoSettingsObj[key] = value;
    save();
}

let get = function (key) {
    if (repoSettingsObj[key] !== undefined) {
        return repoSettingsObj[key];
    }
    if (settingsObj.app_settings[key] !== undefined) {
        return settingsObj.app_settings[key];
    }
    return undefined;
}

module.exports = {
    init: init,
    save: save,
    load: load,
    update: update,
    get: get,
    setRepo: setRepo,
    updateRepoSetting: updateRepoSetting,
    privateKey: () => privContent,
    publicKey: () => publicContent,
}