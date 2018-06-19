import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-title-editor',
  templateUrl: './title-editor.component.html',
  styleUrls: ['./title-editor.component.scss']
})
export class TitleEditorComponent implements OnInit {

  @Input()
  set text(txt: string) {
    this._text = txt;
    this.textChange.emit(this._text);
  }
  get text(): string {
    return this._text;
  }
  @Output() textChange = new EventEmitter<string>();
  @Output() toConfirm = new EventEmitter();
  private _text = "";
  private editText = "";
  private editing = false;
  constructor() { }

  ngOnInit() {
  }

  toggleEdit() {
    this.editText = this._text;
    this.editing = true;
  }
  cancelEdit() {
    this.editing = false;
  }
  confirmEdit() {
    this.text = this.editText;
    this.toConfirm.emit();
    this.editing = false;
  }
}
