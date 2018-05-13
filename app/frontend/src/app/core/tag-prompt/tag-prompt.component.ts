import { Component, OnInit, EventEmitter } from '@angular/core';
import { Prompt } from '../../infrastructure/prompt';

@Component({
  selector: 'app-tag-prompt',
  templateUrl: './tag-prompt.component.html',
  styleUrls: ['./tag-prompt.component.scss']
})
export class TagPromptComponent implements OnInit, Prompt {

  toClose = new EventEmitter();
  toCreate = new EventEmitter<{sha: string, name: string}>();
  sha = "";
  private tagName = "";
  constructor() { }

  ngOnInit() {
  }

  enter() {
    this.toCreate.emit({sha: this.sha, name: this.tagName});
    this.toClose.emit();
  }
  close() {
    this.toClose.emit();
  }

}
