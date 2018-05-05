import { Component, OnInit, EventEmitter } from '@angular/core';
import { Prompt } from '../../infrastructure/prompt';

@Component({
  selector: 'app-force-push-prompt',
  templateUrl: './force-push-prompt.component.html',
  styleUrls: ['./force-push-prompt.component.scss']
})
export class ForcePushPromptComponent implements OnInit, Prompt {

  toClose = new EventEmitter();
  onResult = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  enter() {
    this.toClose.emit();
    this.onResult.emit(true);
  }
  close() {
    this.toClose.emit();
    this.onResult.emit(false);
  }
}
