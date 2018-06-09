import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { NotificationsService } from 'angular2-notifications';
import { StatusBarService } from './status-bar.service';

@Injectable()
export class UpdaterService {

  constructor(
    private electron: ElectronService,
    private noti: NotificationsService,
    private status: StatusBarService,
  ) {
    electron.onCD('Updater', (event, arg) => {
      if (arg.msg === 'update-available') {
        let notification = this.noti.info("Update Available", "Click here to install update, the app will restart automatically to update");
        notification.click.subscribe(() => {
          this.electron.ipcRenderer.send('Updater', 'commence-download');
        });
      } else if (arg.msg === 'downloading-update') {
        this.status.enableLoading(`Downloading: ${Math.floor(arg.percentage)}%`);
      } else if (arg.msg === 'download-complete') {
        this.status.flash('success', "Update download successful, the app will restart soon...");
        let that = this;
        setTimeout(() => {
          that.electron.ipcRenderer.send('Updater', 'commence-install-update');
        }, 10 * 1000);
      }
    });
  }
  init() {

  }
}
