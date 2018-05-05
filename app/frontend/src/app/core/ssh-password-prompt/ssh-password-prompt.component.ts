import { Component, OnInit, EventEmitter } from '@angular/core';
import { Prompt } from '../../infrastructure/prompt';

@Component({
  selector: 'app-ssh-password-prompt',
  templateUrl: './ssh-password-prompt.component.html',
  styleUrls: ['./ssh-password-prompt.component.scss']
})
export class SshPasswordPromptComponent implements OnInit, Prompt {

  toClose = new EventEmitter();
  password = "";
  onEnter = new EventEmitter<{password: string}>();
  constructor() { }

  ngOnInit() {
  }
  close() {
    this.toClose.emit();
  }
  enter() {
    this.onEnter.emit({password: this.password});
    this.close();
  }
}
