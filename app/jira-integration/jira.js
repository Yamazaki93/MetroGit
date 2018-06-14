const { ipcMain } = require('electron');
const { requireArgParams } = require('../infrastructure/handler-helper');
const axios = require('axios');
var username = "";
var apiToken = "";
var address = "";
var secureStorage;
var settings;
var conn;
var window;

ipcMain.on('JIRA-RepoChanged', requireArgParams(initJira, ['id']));
ipcMain.on('JIRA-GetIssue', requireArgParams(getIssue, ['key']));
ipcMain.on('JIRA-UpdateIssue', requireArgParams(updateIssue, ['key', 'data']));
ipcMain.on('JIRA-AddComment', requireArgParams(addComment, ['key', 'body']));
ipcMain.on('JIRA-GetAssignableUsers', requireArgParams(findAssignableUsers, ['key']));
ipcMain.on('JIRA-AssignIssue', requireArgParams(assignIssue, ['key', 'name']));
ipcMain.on('JIRA-AddSubtask', requireArgParams(addSubtask, ['key', 'name']));
ipcMain.on('JIRA-SearchIssues', requireArgParams(searchIssues, ['jql']));

function init(sett, sec, win) {
    secureStorage = sec;
    settings = sett;
    window = win;

}

function initJira(event, arg) {
    if (settings.get('jira-enabled')) {
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
                        } else if (error.request.path.indexOf('search') !== -1) {
                            // swallow search errors
                            return Promise.resolve('QUERY_ISSUE');
                        } else {
                            window.webContents.send('JIRA-OperationFailed', {});
                        }
                    } else if (error.code === 'ECONNABORTED') {
                        window.webContents.send('JIRA-Timeout', { error: error })
                    } else {
                        window.webContents.send('JIRA-Error', { error: error });
                    }
                    return Promise.reject(error);
                });
                getResolution();
                getIssueTypes();
            } else {
                conn = null;
            }
        });
    } else {
        conn = null;
    }
}

function getIssue(event, arg) {
    if (conn) {
        return getJiraIssue(arg.key).then(result => {
            checkStoryFields(result);
            event.sender.send('JIRA-IssueRetrieved', { issue: result.data })
        })
    }
}

function addComment(event, arg) {
    if (conn) {
        let data = {
            'body': arg.body
        }
        return conn.post(`/issue/${arg.key}/comment`, data).then(result => {
            return getIssue(event, arg);
        })
    }
}

function getJiraIssue(key) {
    if (conn) {
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
            window.webContents.send('JIRA-ResolutionsRetrieved', { resolutions: result.data });
        })
    }
}

function getIssueTypes() {
    if (conn) {
        return conn.get('/issuetype').then(result => {
            let subtaskType;
            result.data.forEach(issueType => {
                if (issueType.subtask) {
                    subtaskType = issueType;
                }
            })
            window.webContents.send('JIRA-IssueTypesRetrieved', { issueTypes: result.data, subtaskType: subtaskType })
        })
    }
}

function updateIssue(event, arg) {
    if (conn) {
        let req;
        if (arg.data.transition) {
            req = conn.post(`/issue/${arg.key}/transitions`, arg.data);
        } else {
            req = conn.put(`/issue/${arg.key}`, arg.data);
        }
        return req.then(result => {
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

function findAssignableUsers(event, arg) {
    if (conn) {
        let url = `/user/assignable/search?issueKey=${arg.key}`;
        if (arg.search) {
            url += '&username=' + arg.search;
        }
        return conn.get(url).then(result => {
            let resp = { key: arg.key, result: result.data };
            event.sender.send('JIRA-AssignableUsersRetrieved', { result: resp });
        })
    }
}

function assignIssue(event, arg) {
    if (conn) {
        return conn.put(`/issue/${arg.key}/assignee`, { name: arg.name }).then(result => {
            getIssue(event, arg);
        });
    }
}

function addSubtask(event, arg) {
    if (conn) {
        return conn.post(`/issue`, {
            "fields": {
                "project": {
                    "id": arg.projectId
                },
                "parent": {
                    "key": arg.key
                },
                "issuetype": {
                    "id": arg.subtaskId
                },
                "summary": arg.name,
                "description" : "description"
            }
        }).then(result => {
            getIssue(event, arg);
        });
    }
}

function searchIssues(event, arg) {
    if (conn) {
        let url = `/search`;
        let obj = { jql: arg.jql };
        if (arg.fields) {
            obj.fields = arg.fields;
        }
        return conn.post(url, obj).then(resp => {
            if (resp === 'QUERY_ISSUE') {
                event.sender.send('JIRA-IssueQueryResultRetrieved', { issues: [] });
            } else {
                event.sender.send('JIRA-IssueQueryResultRetrieved', { issues: resp.data.issues });
            }
        })
    }
}

module.exports = {
    init: init
}