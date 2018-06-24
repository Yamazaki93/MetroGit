const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const settingsService = require('./infrastructure/settings');
const repo = require('./git/repo');
const autoFetch = require('./git/auto-fetch');
const secureStorage = require('./infrastructure/secure');
const repoCH = require('./git/repo-command-handler');
const appveyorService = require('./ci-integration/appveyor');
const jiraService = require('./jira-integration/jira');
const shellMisc = require('./infrastructure/shell');
const cache = require('./infrastructure/cache');
const fileWatcher = require('./git/file-watcher');
const updater = require('./infrastructure/auto-updater');
const externalFile = require('./git/external-file-view');
const releaseNote = require('./infrastructure/release-note');
const submodules = require('./git/submodules');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({})
    
    // init services
    secureStorage.init(win);
    fileWatcher.init(win);
    submodules.init(win);
    externalFile.init(fileWatcher);
    settingsService.init(win, secureStorage);
    releaseNote.init(settingsService, win);
    cache.init(settingsService, win);
    repo.init(win, settingsService, secureStorage, fileWatcher);
    autoFetch.init(win, settingsService);
    repoCH.init(repo, settingsService, secureStorage);
    appveyorService.init(settingsService, secureStorage, win, cache);
    jiraService.init(settingsService, secureStorage, win);
    shellMisc.init();
    updater.init(win, settingsService);

    const menuTemplate = [
        {
            label: "File",
            submenu: [
                {
                    label: "Quit",
                    accelerator: 'CommandOrControl+q',
                    click(item, focusedWindow){
                        app.quit();
                    }
                }
            ]
        },
        {
            label: "View",
            submenu: [
                {
                    label: "Refresh",
                    accelerator: 'F5',
                    click(item, focusedWindow) {
                        focusedWindow.reload();
                    }
                }
            ]
        },
        {
            label: "Dev",
            submenu: [
                {
                    label: "Toggle Dev Tools",
                    accelerator: "F12",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
            ]
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "Release Notes",
                    click(item, focusedWindow) {
                        releaseNote.openReleaseNote();
                    }
                },
                {
                    label: "About",
                    click(item, focusedWindow) {
                        releaseNote.openAboutPage();
                    }
                }
            ]
        }
    ];
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname:  path.join(__dirname, 'frontend/dist/index.html'),
        hash: '/git',
        protocol: 'file:',
        slashes: true
    }))

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
    win.maximize();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.