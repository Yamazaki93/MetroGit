import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { LoadingService } from '../loading-service.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {

  message = "";
  @HostBinding('style.display') style = 'none';
  @ViewChild('spinner') spinner: SpinnerComponent;
  set enabled(newStatus: boolean) {
    this._enabled = newStatus;
    if (this._enabled) {
      this.style = 'block';
    } else {
      this.style = 'none';
    }
    this.spinner.enabled = this._enabled;
  }

  private _enabled = false;
  constructor(
    private loadingService: LoadingService
  ) {
    loadingService.change.subscribe(isBusy => {
      this.enabled = isBusy;
    });
    loadingService.messageChange.subscribe(message => {
      this.message = message;
    });
  }

  ngOnInit() {
  }

}
