import { Injectable, EventEmitter, Output } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';

@Injectable()
export class HistoryService {

  @Output() historyChange = new EventEmitter<any>();
  repos = [];
  constructor(
    private electron: ElectronService
  ) {
    electron.onCD('Repo-HistoryChanged', (event, arg) => {
      this.repos = arg.history;
      this.historyChange.emit(this.repos);
    });
  }

}
