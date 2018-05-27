import { Injectable, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';

@Injectable()
export class SubmodulesService {

  @Output() submoduleChanged = new EventEmitter<any[]>();
  submodules;
  constructor(
    private electron: ElectronService
  ) {
    this.electron.onCD('Repo-SubmoduleNamesRetrieved', (event, arg) => {
      this.submodules = arg.submodules;
      this.submoduleChanged.emit(this.submodules);
    });
  }
}
