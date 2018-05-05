import { Component, OnInit, EventEmitter } from '@angular/core';
import { Prompt } from '../../infrastructure/prompt';


@Component({
  selector: 'app-enter-login-prompt',
  templateUrl: './enter-login-prompt.component.html',
  styleUrls: ['./enter-login-prompt.component.scss']
})
export class EnterLoginPromptComponent implements OnInit, Prompt {

  toClose = new EventEmitter();
  username = "";
  password = "";
  onEnter = new EventEmitter<{username: string, password: string}>();
  constructor() { }

  ngOnInit() {
  }
  close() {
    this.toClose.emit();
  }
  enter() {
    this.onEnter.emit({username: this.username, password: this.password});
    this.close();
  }
}
