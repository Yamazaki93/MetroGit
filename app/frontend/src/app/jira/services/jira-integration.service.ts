import { Injectable, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { Issue } from '../models/issue';
import { NotificationsService } from 'angular2-notifications';
import { StatusBarService } from '../../infrastructure/status-bar.service';
import { Profile } from '../models/profile';
import { IssueType } from '../models/issue-type';
import { Resolution } from '../models/resolution';

@Injectable()
export class JiraIntegrationService {

  @Output() issueRetrieved: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() subtaskRetrieved: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() enabledChanged = new EventEmitter<boolean>();
  @Output() assignableRetrieved = new EventEmitter<{ key: string, result: Profile[] }>();
  @Output() issueQueryRetrieved: EventEmitter<Issue[]> = new EventEmitter<Issue[]>();
  @Output() resolutionRetrieved: EventEmitter<Resolution[]> = new EventEmitter<Resolution[]>();
  @Output() changeIssue: EventEmitter<string> = new EventEmitter<string>();
  @Output() previousIssueStateChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() nextIssueStateChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  enabled = false;
  jiraUrl = "";
  previousIssueStack: string[] = [];
  nextIssueStack: string[] = [];
  private jiraKeys = [];
  resolutions: Resolution[] = [];
  private issueTypes: IssueType[] = [];
  private subtaskType: IssueType;
  constructor(
    private electron: ElectronService,
    private noti: NotificationsService,
    private statusBarSvc: StatusBarService,
  ) {
    electron.onCD('Settings-EffectiveUpdated', (event, arg) => {
      if (!arg['jira-enabled'] || !arg['jira-keys'] || arg['jira-keys'].split(';').length === 0) {
        this.enabled = false;
        this.jiraKeys = [];
        this.jiraUrl = "";
      } else {
        this.jiraKeys = arg['jira-keys'].split(';');
        this.jiraUrl = arg['jira-address'];
        this.enabled = true;
      }
      this.enabledChanged.emit(this.enabled);
      electron.ipcRenderer.send('JIRA-RepoChanged', { id: arg.currentRepo.id });
    });
    electron.onCD('JIRA-IssueRetrieved', (event, arg) => {
      this.issueRetrieved.emit(arg.issue);
    });
    electron.onCD('JIRA-ResolutionsRetrieved', (event, arg) => {
      this.resolutions = arg.resolutions;
      this.resolutionRetrieved.emit(this.resolutions);
    });
    electron.onCD('JIRA-IssueTypesRetrieved', (event, arg) => {
      this.issueTypes = arg.issueTypes;
      this.subtaskType = arg.subtaskType;
    });
    electron.onCD('JIRA-Error', (event, arg) => {
      noti.error("Error", "Your JIRA setup doesn't seemed to be correct, please enter the correct settings");
    });
    electron.onCD('JIRA-Timeout', (event, arg) => {
      statusBarSvc.flash('warning', "JIRA connection timeout, your network connection might be unstable");
    });
    electron.onCD('JIRA-OperationFailed', (event, arg) => {
      noti.error("Failed", "Operation failed, please reload this issue and try again");
      this.issueRetrieved.emit(null);
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
    electron.onCD('JIRA-IssueQueryResultRetrieved', (event, arg) => {
      this.issueQueryRetrieved.emit(arg.issues);
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
  updateIssue(key, fields, transition?) {
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
    this.electron.ipcRenderer.send('JIRA-AddSubtask', { key: key, name: name, projectId: projectId, subtaskId: this.subtaskType.id });
  }
  searchIssuesByKey(keyQuery, fields?) {
    let jql = `key = "${keyQuery}"`;
    this.electron.ipcRenderer.send('JIRA-SearchIssues', { jql: jql, fields: fields });
  }
  searchIssuesBySummary(textQuery, fields?) {
    let jql = `summary ~ "\\"${textQuery}\\""`;
    this.electron.ipcRenderer.send('JIRA-SearchIssues', { jql: jql, fields: fields });
  }
  navigateToIssue(key) {
    this.changeIssue.emit(key);
  }
  pushPrevious(key) {
    if (this.previousIssueStack.indexOf(key) === -1 && key) {
      this.previousIssueStack.push(key);
      if (this.previousIssueStack.length === 1) {
        this.previousIssueStateChanged.emit(true);
      }
    }
  }
  pushNext(key) {
    if (this.nextIssueStack.indexOf(key) === -1) {
      this.nextIssueStack.push(key);
      if (this.nextIssueStack.length === 1) {
        this.nextIssueStateChanged.emit(true);
      }
    }
  }
  gotoPrevious() {
    if (this.previousIssueStack.length) {
      let issue = this.previousIssueStack.pop();
      this.navigateToIssue(issue);
      if (!this.previousIssueStack.length) {
        this.previousIssueStateChanged.emit(false);
      }
    }
  }
  gotoNext() {
    if (this.nextIssueStack.length) {
      let issue = this.nextIssueStack.pop();
      this.navigateToIssue(issue);
      if (!this.nextIssueStack.length) {
        this.nextIssueStateChanged.emit(false);
      }
    }
  }
}
