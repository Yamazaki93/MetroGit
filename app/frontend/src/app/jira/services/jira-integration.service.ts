import { Injectable, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { Issue } from '../models/issue';
import { NotificationsService } from 'angular2-notifications';
import { StatusBarService } from '../../infrastructure/status-bar.service';
import { Profile } from '../models/profile';

@Injectable()
export class JiraIntegrationService {

  @Output() issueRetrieved: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() subtaskRetrieved: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() enabledChanged = new EventEmitter<boolean>();
  @Output() assignableRetrieved = new EventEmitter<{ key: string, result: Profile[] }>();
  enabled = false;
  private jiraKeys = [];
  private resolutions = [];
  constructor(
    private electron: ElectronService,
    private noti: NotificationsService,
    private statusBarSvc: StatusBarService
  ) {
    electron.onCD('Settings-EffectiveUpdated', (event, arg) => {
      if (!arg['jira-enabled'] || !arg['jira-keys'] || arg['jira-keys'].split(';').length === 0) {
        this.enabled = false;
        this.jiraKeys = [];
      } else {
        this.jiraKeys = arg['jira-keys'].split(';');
        this.enabled = true;
      }
      this.enabledChanged.emit(this.enabled);
      electron.ipcRenderer.send('JIRA-RepoChanged', { id: arg.currentRepo.id });
    });
    electron.onCD('JIRA-IssueRetrieved', (event, arg) => {
      this.issueRetrieved.emit(arg.issue);
    });
    electron.onCD('JIRA-TransitionsRetrieved', (event, arg) => {
      this.resolutions = arg.resolutions;
    });
    electron.onCD('JIRA-Error', (event, arg) => {
      noti.error("Error", "Your JIRA setup doesn't seemed to be correct, please enter the correct settings");
    });
    electron.onCD('JIRA-Timeout', (event, arg) => {
      statusBarSvc.flash('warning', "JIRA connection timeout, your network connection might be unstable");
    });
    electron.onCD('JIRA-OperationFailed', (event, arg) => {
      noti.error("Failed", "Operation failed, please reload this issue and try again");
    });
    electron.onCD('JIRA-NotFound', (event, arg) => {
      noti.warn("Not Found", "JIRA issue not found, server returned 404");
      this.issueRetrieved.emit(null);
    });
    electron.onCD('JIRA-CAPTCHARequired', (event, arg) => {
      noti.warn("JIRA Limiting", "You have triggered JIRA's CAPTCHA detection, please login using your browser and solve the challenge before attempting more requests");
    });
    electron.onCD('JIRA-AssignableUsersRetrieved', (event, arg) => {
      this.assignableRetrieved.emit(arg.result);
    });
  }
  parseKeyFromMessage(message, detail) {
    if (this.jiraKeys.length > 0) {
      let foundKeys = [];
      this.jiraKeys.forEach(key => {
        let re = new RegExp(`${key}-\\d+`, 'g');
        if (message) {
          let found = message.match(re);
          if (found) {
            foundKeys = foundKeys.concat(found);
          }
        }
        if (detail) {
          let found = detail.match(re);
          if (found) {
            foundKeys = foundKeys.concat(found);
          }
        }
      });
      return foundKeys;
    } else {
      return [];
    }
  }
  getIssue(key) {
    this.electron.ipcRenderer.send('JIRA-GetIssue', { key: key });
  }
  addComment(key, body) {
    this.electron.ipcRenderer.send('JIRA-AddComment', { key: key, body: body });
  }
  updateIssue(key, fields, transition) {
    let data = {};
    if (fields) {
      data['fields'] = fields;
    }
    if (transition) {
      data['transition'] = transition;
    }
    this.electron.ipcRenderer.send('JIRA-UpdateIssue', { key: key, data: data });
  }
  findAssignableUsers(key, search = "") {
    this.electron.ipcRenderer.send('JIRA-GetAssignableUsers', { key: key, search: search });
  }
  assignIssue(key, name) {
    this.electron.ipcRenderer.send('JIRA-AssignIssue', { key: key, name: name });
  }
  addSubtask(key, name, projectId) {
    this.electron.ipcRenderer.send('JIRA-AddSubtask', { key: key, name: name, projectId: projectId});
  }
}
