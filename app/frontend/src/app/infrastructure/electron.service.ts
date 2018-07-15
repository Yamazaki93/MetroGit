import { Injectable, ChangeDetectorRef, NgZone } from '@angular/core';
declare var electron: any;


@Injectable()
export class ElectronService {
  private initialized = false;
  ipcRenderer = null;
  constructor(
    private zone: NgZone
  ) {
    if (electron) {
      this.ipcRenderer = electron.ipcRenderer;
      this.initialized = true;
    } else {
      console.warn('Electron not available');
    }
  }

  // safe subscribe method for angular change detection
  onCD(event: string, handler: Function) {
    if (this.available) {
      this.ipcRenderer.on(event, (ev, arg) => {
        this.zone.run(() => {
          handler(ev, arg);
        });
      });
    }
  }
  on(event: string, handler: Function) {
    if (this.available) {
      this.ipcRenderer.on(event, (ev, arg) => {
        handler(ev, arg);
      });
    }
  }

  openUrlExternal(url: string) {
    if (this.available) {
      this.ipcRenderer.send('Shell-Open', {url: url});
    }
  }

  get available(): boolean {
    return this.initialized;
  }
}
