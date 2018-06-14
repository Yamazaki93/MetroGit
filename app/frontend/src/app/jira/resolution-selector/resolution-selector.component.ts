import { Component, OnInit, EventEmitter } from '@angular/core';
import { Prompt } from '../../infrastructure/prompt';

@Component({
  selector: 'app-resolution-selector',
  templateUrl: './resolution-selector.component.html',
  styleUrls: ['./resolution-selector.component.scss']
})
export class ResolutionSelectorComponent implements OnInit, Prompt {

  toClose = new EventEmitter();
  toEnter = new EventEmitter<string>();
  key = "";
  private _resolution;
  private resolutions = [];
  constructor() { }

  ngOnInit() {
  }

  enter() {
    this.toEnter.emit(this._resolution);
    this.toClose.emit();
  }
  close() {
    this.toClose.emit();
  }

}
