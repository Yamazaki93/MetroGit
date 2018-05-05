const { ipcMain } = require('electron');
const axios = require('axios');
var username = "";
var apiToken = "";
var address = "";
var secureStorage;
var settings;
var conn;
var window;

function init(sett, sec, win) {
    secureStorage = sec;
    settings = sett;
    window = win;
    ipcMain.on('JIRA-RepoChanged', initJira);
    ipcMain.on('JIRA-GetIssue', getIssue);
    ipcMain.on('JIRA-UpdateIssue', updateIssue);
    ipcMain.on('JIRA-AddComment', addComment);
}

function initJira(event, arg) {
    if (arg.id && settings.get('jira-enabled')) {
        username = settings.get('jira-username');
        address = settings.get('jira-address');
        secureStorage.getPass(`jira-token@${arg.id}`).then(pass => {
            apiToken = pass;
            if (username && apiToken && address) {
                conn = axios.create({
                    baseURL: `https://${address}/rest/api/2`,
                    timeout: 10 * 1000,
                    headers: { 'Authorization': `Basic ${Buffer.from(username + ':' + apiToken).toString('base64')}` }
                });
                // setup response inteceptors
                conn.interceptors.response.use(function (response) {
                    return response;
                }, function (error) {
                    if (error.response) {
                        if (error.response.headers['X-Seraph-LoginReason'] === 'AUTHENTICATION_DENIED') {
                            window.webContents.send('JIRA-CAPTCHARequired', {});
                            return Promise.resolve(error);
                        } else if (error.response.status === 404) {
                            window.webContents.send('JIRA-NotFound', {});
                            return Promise.reject(error);
                        } else {
                            window.webContents.send('JIRA-OperationFailed', {});
                        }
                    } else if(error.code === 'ECONNABORTED') {
                        window.webContents.send('JIRA-Timeout', {error: error})
                    } else {
                        window.webContents.send('JIRA-Error', {error: error});
                    }
                    return Promise.reject(error);
                });
                getResolution();
            } else {
                conn = null;
            }
        });
    } else {
        conn = null;
    }
}

function getIssue(event, arg) {
    if (conn && arg.key) {
        return getJiraIssue(arg.key).then(result => {
            checkStoryFields(result);
            event.sender.send('JIRA-IssueRetrieved', { issue: result.data })
        })
    }
}

function addComment(event, arg) {
    if (conn && arg.key && arg.body) {
        let data = {
            'body': arg.body
        }
        return conn.post(`/issue/${arg.key}/comment`, data).then(result => {
            return getIssue(event, arg);
        })
    }
}

function getJiraIssue(key) {
    if(conn) {
        return conn.get(`/issue/${key}?expand=renderedFields,names,transitions`).then(result => {
            result.data.fields.description = result.data.renderedFields.description;
            return result;
        });
    } else {
        return Promise.reject('NO_CONN');
    }
}

function getResolution() {
    if (conn) {
        return conn.get(`/resolution`).then(result => {
            window.webContents.send('JIRA-ResolutionsRetrieved', { resolutions: result });
        })
    }
}

function updateIssue(event, arg) {
    if(conn && arg.key && arg.data) {
        return conn.post(`/issue/${arg.key}/transitions`, arg.data).then(result => {
            return getIssue(event, arg);
        })
    }
}

function checkStoryFields(expandedResult) {
    Object.keys(expandedResult.data.names).forEach(k => {
        // check story points
        if (expandedResult.data.names[k] === 'Story Points') {
            expandedResult.data.fields.storyPoints = expandedResult.data.fields[k];
        }
    })
}

module.exports = {
    init: init
}