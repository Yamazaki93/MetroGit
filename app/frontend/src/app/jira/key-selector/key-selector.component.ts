import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-key-selector',
  templateUrl: './key-selector.component.html',
  styleUrls: ['./key-selector.component.scss']
})
export class KeySelectorComponent implements OnInit {

  @Input() set currentIssueKey(key: string) {
    this._key = key;
  }
  @Output() currentIssueKeyChange = new EventEmitter<string>();

  get currentIssueKey() {
    return this._key;
  }
  private _key = "";
  private editing = false;
  private queryKey = "";
  constructor() { }

  ngOnInit() {
  }

  enableEditing() {
    this.queryKey = this._key;
    this.editing = true;
  }
  cancelEdit() {
    this.editing = false;
  }

}
