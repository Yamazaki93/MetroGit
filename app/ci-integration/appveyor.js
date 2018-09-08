const { ipcMain } = require('electron');
const { requireArgParams } = require('../infrastructure/handler-helper');
const axios = require('axios');
const serviceKey = 'AppVeyor';
var accountName = "";
var projectName = "";
var secureStorage;
var settings;
var conn;
var window;
var cache;
var checkPeriodicUpdateHook;

ipcMain.on('CI-RepoChanged', repoChange);
ipcMain.on('CI-AppVeyorRebuild', reBuildAppVeyor);
ipcMain.on('CI-AppVeyorGetLog', requireArgParams(getBuildLog, ['version']));

function init(sett, sec, win, cac) {
    secureStorage = sec;
    settings = sett;
    window = win;
    cache = cac;
}

function repoChange(event, arg) {
    registry = {};
    clearInterval(checkPeriodicUpdateHook);
    if (arg.id && settings.get('ci-appveyor')) {
        accountName = settings.get('ci-appveyor-account');
        projectName = settings.get('ci-appveyor-project')
        secureStorage.getPass(`ci-appveyor-token@${arg.id}`).then(value => {
            if (value) {
                conn = axios.create({
                    baseURL: 'https://ci.appveyor.com/api/',
                    timeout: 10 * 1000,
                    headers: { 'Authorization': `Bearer ${value}` }
                })
                setTimeout(() => {
                    getExistingHistory();
                }, 5 * 1000);
                checkPeriodicUpdateHook = setInterval(() => {
                    periodicUpdate();
                }, 20 * 1000);
            } else {
                conn = null;
            }
        });
    } else {
        conn = null;
    }
}

async function getExistingHistory() {
    if (conn) {
        window.webContents.send('CI-QueryBegan', { service: serviceKey });
        let batch = 2;
        let allBuilds = [];
        let startBuild;
        for (let i = 0; i < batch; i++) {
            let url = `/projects/${accountName}/${projectName}/history?recordsNumber=100`;
            if (startBuild) {
                url += `&startBuildId=${startBuild}`;
            }
            let resp = await conn.get(url);
            if (!resp) {
                window.webContents.send('CI-RequestError', { error: 'GENERIC', detail: err.message, service: serviceKey });
            } else {
                allBuilds = allBuilds.concat(resp.data.builds);
                if (resp.data.builds.length === 100) {
                    startBuild = resp.data.builds[resp.data.builds.length - 1].buildId;
                } else {
                    break;
                }
            }
        }
        let allResults = formatResults(allBuilds);
        window.webContents.send('CI-BuildsRetrieved', { service: serviceKey, data: allResults })
    }
}

function formatResults(builds) {
    let result = builds.map(b => {
        return {
            commit: b.commitId,
            status: b.status,
            buildId: b.buildId,
            build: b.buildNumber,
            version: b.version,
            branch: b.branch,
        }
    });
    let existing = {};
    for (let i = 0; i < result.length; i++) {
        if (existing[result[i].commit]) {
            result.splice(i, 1);
            i -= 1;
        } else {
            existing[result[i].commit] = true;
        }
    }
    return result;
}

function periodicUpdate() {
    if (conn) {
        conn.get(`/projects/${accountName}/${projectName}/history?recordsNumber=30`).then(resp => {
            let result = formatResults(resp.data.builds);
            window.webContents.send('CI-BuildsRetrieved', { service: serviceKey, data: result })
        }).catch(err => {
            window.webContents.send('CI-RequestError', { error: 'GENERIC', detail: err.message, service: serviceKey });
        })
    }
}

function getBuildLog(event, arg) {
    if (conn) {
        conn.get(`/projects/${accountName}/${projectName}/build/${arg.version}`).then(resp => {
            if (resp.data.build.jobs.length) {
                let jobId = resp.data.build.jobs[0].jobId;
                cache.downloadFile(`${conn.defaults.baseURL}/buildjobs/${jobId}/log`, conn.defaults.headers).then(content => {
                    event.sender.send('CI-AppVeyorLogRetrieved', { version: arg.version, result: content });
                });
            } else {
                event.sender.send('CI-AppVeyorLogNotFound', { version: arg.version });
            }
        })
    }
}

function reBuildAppVeyor(event, arg) {
    if (conn && arg.commit) {
        conn.post(`builds`, {
            "accountName": accountName,
            "projectSlug": projectName,
            "branch": arg.branch,
            "commitId": arg.commit
        }).then(resp => {
            event.sender.send('CI-AppVeyorRebuilded', {});
        }).catch(err => {
            event.sender.send('CI-AppVeyorRebuildFailed', {});
        })
    }
}

module.exports = {
    init: init
}