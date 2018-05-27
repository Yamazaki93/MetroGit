import { Injectable, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';

@Injectable()
export class SubmodulesService {

  @Output() submoduleChanged = new EventEmitter<any[]>();
  @Output() submoduleSelected = new EventEmitter<string>();
  @Output() submoduleDetailChanged = new EventEmitter<any>();
  submodules;
  selectedSubmodule = "";
  submoduleDetails;
  constructor(
    private electron: ElectronService
  ) {
    this.electron.onCD('Repo-SubmoduleNamesRetrieved', (event, arg) => {
      this.submodules = arg.submodules;
      this.submoduleChanged.emit(this.submodules);
    });
    this.electron.onCD('Repo-SubmoduleDetailsRetrieved', (event, arg) => {
      this.submoduleDetails = arg.result;
      this.submoduleDetailChanged.emit(this.submoduleDetails);
    });
  }

  selectSubmodule(name) {
    this.selectedSubmodule = name;
    this.submoduleSelected.emit(name);
  }

  getSubmoduleDetails(name) {
    this.electron.ipcRenderer.send('Repo-GetSubmoduleDetails', {name: name});
  }
}
