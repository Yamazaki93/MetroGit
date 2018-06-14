import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { Prompt } from '../../infrastructure/prompt';

@Component({
  selector: 'app-add-comment-prompt',
  templateUrl: './add-comment-prompt.component.html',
  styleUrls: ['./add-comment-prompt.component.scss']
})
export class AddCommentPromptComponent implements OnInit, Prompt {

  toClose: EventEmitter<{}> = new EventEmitter();
  key: string;

  @Output() canceling = new EventEmitter();
  private comment = "";
  constructor(
    private jira: JiraIntegrationService
  ) { }

  ngOnInit() {
  }

  enter() {
    this.jira.addComment(this.key, this.comment);
    this.toClose.emit();
  }

  close() {
    this.toClose.emit();
    this.canceling.emit();
  }
}
