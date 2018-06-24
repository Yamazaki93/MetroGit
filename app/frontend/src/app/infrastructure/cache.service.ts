import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { StatusBarService } from './status-bar.service';

@Injectable()
export class CacheService {

  constructor(
    private electron: ElectronService,
    private statusBar: StatusBarService
  ) {
    this.electron.onCD('Cache-AutoCleanBegin', (event, arg) => {
      this.statusBar.enableLoading('Starting auto cache cleanup');
    });
    this.electron.onCD('Cache-AutoCleanSuccess', (event, arg) => {
      this.statusBar.flash('success', "Auto cache cleanup successful");
    });
  }
  init() {
  }

}
