import { Injectable, EventEmitter, Output } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Injectable()
export class LayoutService {

  isNavToggled = true;
  isLocalShown = true;
  isRemoteShown = true;
  isTagsShown = true;
  isDetailPanelOpen = false;

  set isFilePanelOpen(val) {
    if (this._file !== val) {
      this.filePanelChanged.emit(val);
    }
    this._file = val;
  }
  get isFilePanelOpen() {
    return this._file;
  }

  @Output() filePanelChanged = new EventEmitter<boolean>();

  private _file = false;

  constructor() {  }

}
