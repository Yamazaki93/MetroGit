import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()
export class StatusBarService {

  @Output() statusChange = new EventEmitter<Status>();
  private existingTimeout = null;
  constructor() { }

  enableLoading(message) {
    this.statusChange.emit({loading: true, type: 'loading', message: message, show: true});
  }
  disableLoading() {
    this.hide();
  }
  flash(type, message) {
    this.statusChange.emit({loading: false, type: type, message: message, show: true});
    let that = this;
    if (this.existingTimeout) {
      clearTimeout(this.existingTimeout);
    }
    let timeout = 7000;
    if (type === 'warning' || type === 'danger') {
      timeout = 30 * 1000;
    }
    this.existingTimeout = setTimeout(() => {
      that.hide();
    }, timeout);
  }
  private hide() {
    this.statusChange.emit({loading: false, type: null, message: null, show: false});
  }
}

interface Status {
  loading: boolean;
  type: string;
  message: string;
  show: boolean;
}
