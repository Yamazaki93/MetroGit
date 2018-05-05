import { Component, OnInit, EventEmitter } from '@angular/core';
import { Prompt } from '../../infrastructure/prompt';

@Component({
  selector: 'app-create-branch-prompt',
  templateUrl: './create-branch-prompt.component.html',
  styleUrls: ['./create-branch-prompt.component.scss']
})
export class CreateBranchPromptComponent implements OnInit, Prompt {

  toClose = new EventEmitter();
  branchName = "";
  onEnter = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }
  close() {
    this.toClose.emit();
  }
  enter() {
    this.onEnter.emit(this.branchName);
    this.close();
  }
}

