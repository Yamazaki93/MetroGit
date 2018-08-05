import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommitMessage } from '../models/commit-message';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { Issue } from '../models/issue';
import { ElectronService } from '../../infrastructure/electron.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { AddCommentPromptComponent } from '../add-comment-prompt/add-comment-prompt.component';
import { SubtaskPromptComponent } from '../subtask-prompt/subtask-prompt.component';
import { KeySelectorComponent } from '../key-selector/key-selector.component';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-jira-detail',
  templateUrl: './jira-detail.component.html',
  styleUrls: ['./jira-detail.component.scss']
})
export class JiraDetailComponent implements OnInit, OnDestroy {

  @ViewChild('keySelector') keySelector: KeySelectorComponent;
  @Input() set commit(cmt: CommitMessage) {
    if (cmt) {
      let result = this.jira.parseKeyFromMessage(cmt.message, cmt.detail);
      if (result.length > 0) {
        if (this.currentIssueKey && this.currentIssueKey !== result[0]) {
          this.jira.pushPrevious(this.currentIssueKey);
        }
        this.currentIssueKey = result[0];
        this.loading = true;
        this.jira.navigateToIssue(this.currentIssueKey);
      }
    } else if (!this.issue) {
      this.currentIssueKey = "";
      this.keySelector.enableEditing();
    }
  }
  canPrevious = false;
  canNext = false;
  private currentIssueKey = "";
  private issue: Issue;
  private issueIconUrl: SafeResourceUrl;
  private priorityIconUrl: SafeResourceUrl;
  private reporterIconUrl: SafeUrl;
  private assigneeIconUrl: SafeUrl;
  private loading = false;
  private tooltip = true;
  private subs: Subscription[] = [];
  constructor(
    private electron: ElectronService,
    private jira: JiraIntegrationService,
    private sanitizer: DomSanitizer,
    private promptInj: PromptInjectorService,
    private layout: LayoutService
  ) {
    this.subs.push(jira.issueRetrieved.subscribe(iss => {
      if (!iss) {
        this.loading = false;
      } else if (iss.key === this.currentIssueKey) {
        this.issue = iss;
        this.formatCurrentIssue();
        this.querySubtasks();
        this.loading = false;
      } else if (iss.fields.issuetype.subtask && this.issue && this.issue.fields.subtasks) {
        let subtaskKeys = this.issue.fields.subtasks.map(sub => sub.key);
        let index = subtaskKeys.indexOf(iss.key);
        if (index !== -1) {
          this.issue.fields.subtasks.forEach(task => {
            if (task.key === iss.key) {
              task.transitions = iss.transitions;
              task.fields.status = iss.fields.status;
            }
          });
          this.loading = false;
        }
      }
    }));
    this.subs.push(jira.changeIssue.subscribe(iss => {
      this.onRequestPosted();
      this.currentIssueKey = iss;
      this.jira.getIssue(iss);
    }));
    layout.tooltipChanged.subscribe(tp => {
      this.tooltip = tp;
    });
    jira.previousIssueStateChanged.subscribe(s => {
      this.canPrevious = s;
    });
    jira.nextIssueStateChanged.subscribe(s => {
      this.canNext = s;
    });
    this.tooltip = layout.tooltipEnabled;
  }

  ngOnInit() {
  }
  formatCurrentIssue() {
    this.issueIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.issue.fields.issuetype.iconUrl);
    this.priorityIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.issue.fields.priority.iconUrl);
    if (this.issue.fields.reporter) {
      this.issue.fields.reporter.safeAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(this.issue.fields.reporter.avatarUrls['24x24']);
    }
    if (this.issue.fields.assignee) {
      this.issue.fields.assignee.safeAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(this.issue.fields.assignee.avatarUrls['24x24']);
    }
    if (this.issue.fields.subtasks) {
      this.issue.fields.subtasks.forEach(sub => {
        sub.fields.safePriorityIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(sub.fields.priority.iconUrl);
      });
    }
    if (this.issue.fields.comment.comments) {
      this.issue.fields.comment.comments.sort((a, b) => {
        if (a.updated > b.updated) {
          return -1;
        } else {
          return 1;
        }
      });
      if (this.issue.fields.comment.comments.length > 5) {
        this.issue.fields.comment.comments.splice(5, this.issue.fields.comment.comments.length - 5);
      }
      this.issue.fields.comment.comments.forEach(cmt => {
        cmt.updatedString = moment(cmt.updated).format('hh:mm A MM/DD');
        cmt.author.safeAvatarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(cmt.author.avatarUrls['24x24']);
      });
    }
  }
  querySubtasks() {
    if (this.issue.fields.subtasks) {
      this.issue.fields.subtasks.forEach(sub => {
        this.jira.getIssue(sub.key);
      });
    }
  }
  ngOnDestroy() {
    this.subs.map(sub => sub.unsubscribe());
  }
  openIssue() {
    let baseLinks = this.issue.self.split('/rest/api/2');
    if (baseLinks.length) {
      this.electron.openUrlExternal(`${baseLinks[0]}/browse/${this.issue.key}`);
    }
  }
  onRequestPosted() {
    this.loading = true;
  }
  addComment() {
    this.delayEnableLoading();
    let comp = this.promptInj.injectComponent(AddCommentPromptComponent);
    comp.key = this.currentIssueKey;
    comp.canceling.subscribe(closingPromptForm => {
      this.loading = false;
    });
  }
  refreshIssue() {
    this.loading = true;
    this.jira.getIssue(this.currentIssueKey);
  }
  addSubtask() {
    this.delayEnableLoading();
    let elem = this.promptInj.injectComponent(SubtaskPromptComponent);
    elem.key = this.issue.key;
    elem.toCancel.subscribe(() => {
      this.loading = false;
    });
    elem.toEnter.subscribe(name => {
      this.jira.addSubtask(this.currentIssueKey, name, this.issue.fields.project.id);
    });
  }
  updateTitle() {
    this.loading = true;
    this.jira.updateIssue(this.issue.key, { summary: this.issue.fields.summary }, null);
  }

  private delayEnableLoading() {
    let that = this;
    setTimeout(() => {
      that.loading = true;
    }, 400);
  }
  loadIssue(key) {
    this.loading = true;
    if (key !== this.currentIssueKey) {
      this.jira.pushPrevious(this.currentIssueKey);
    }
    this.currentIssueKey = key;
    this.jira.getIssue(key);
  }
  gotoPrevious() {
    if (this.canPrevious) {
      this.jira.pushNext(this.currentIssueKey);
      this.jira.gotoPrevious();
    }
  }
  gotoNext() {
    if (this.canNext) {
      this.jira.pushPrevious(this.currentIssueKey);
      this.jira.gotoNext();
    }
  }
}
