import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()
export class LayoutService {

  set isNavToggled(val) {
    this._nav = val;
    this.layoutChanged.emit();
  }
  get isNavToggled() {
    return this._nav;
  }
  set isLocalShown(val) {
    this._local = val;
    this.layoutChanged.emit();
  }
  get isLocalShown() {
    return this._local;
  }
  set isRemoteShown(val) {
    this._remote = val;
    this.layoutChanged.emit();
  }
  get isRemoteShown() {
    return this._remote;
  }
  set isFilePanelOpen(val) {
    this._file = val;
    this.layoutChanged.emit();
  }
  get isFilePanelOpen() {
    return this._file;
  }
  set isDetailPanelOpen(val) {
    this._details = val;
    this.layoutChanged.emit();
  }
  get isDetailPanelOpen() {
    return this._details;
  }

  @Output() layoutChanged = new EventEmitter();

  private _nav = true;
  private _local = true;
  private _remote = true;
  private _file = false;
  private _details = false;

  constructor() { }

}
