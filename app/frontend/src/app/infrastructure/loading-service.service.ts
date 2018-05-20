import { Injectable, Output, EventEmitter } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class LoadingService {
  get isBusy(): boolean {
    return this._isBusy;
  }
  private _isBusy = false;
  private _busyTimeout: any;
  private _count = 0;
  private _message = "";
  @Output()
  messageChange: EventEmitter<string> = new EventEmitter();
  change: EventEmitter<Boolean> = new EventEmitter();

  constructor(
    private noti: NotificationsService
  ) { }
  updateMessage(message) {
    if (message) {
      this._message = message;
      this.messageChange.emit(this._message);
    }
  }
  enableLoading(message = "Loading...") {
    if (this._count === 0) {
      this._isBusy = true;
      this._emitEvent();
      this._setBusyTimeout();
    }
    this._message = message;
    this.messageChange.emit(this._message);
    this._count += 1;
  }
  disableLoading() {
    if (this._count > 0) {
      this._count -= 1;
    }
    if (this._count <= 0) {
      this._isBusy = false;
      this._emitEvent();
      this._cancelTimeout();
    }
  }

  private _setBusyTimeout() {
    if (this._busyTimeout !== undefined) {
      this._cancelTimeout();
    }
    this._busyTimeout = setTimeout(() => {
      this.disableLoading();
      this.noti.error('Timeout', "Sorry~ This operation has timed out, please reload the app and try again",
        {
          timeOut: 0
        });
    }, 60 * 1000);
  }

  private _cancelTimeout() {
    clearTimeout(this._busyTimeout);
    this._busyTimeout = undefined;
  }

  private _emitEvent() {
    this.change.emit(this._isBusy);
  }

}
