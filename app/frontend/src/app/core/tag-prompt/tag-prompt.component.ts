import { Component, OnInit, EventEmitter } from '@angular/core';
import { Prompt } from '../../infrastructure/prompt';

@Component({
  selector: 'app-tag-prompt',
  templateUrl: './tag-prompt.component.html',
  styleUrls: ['./tag-prompt.component.scss']
})
export class TagPromptComponent implements OnInit, Prompt {

  toClose = new EventEmitter();
  sha = "";
  private tagName = "";
  constructor() { }

  ngOnInit() {
  }

  enter() {

  }
  close() {
    this.toClose.emit();
  }

}
