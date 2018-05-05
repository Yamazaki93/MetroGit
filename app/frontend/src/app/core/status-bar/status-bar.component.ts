import { Component, OnInit } from '@angular/core';
import { StatusBarService } from '../../infrastructure/status-bar.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {

  private loading = false;
  private message = "";
  private type = "";
  private show = false;
  constructor(
    private sbService: StatusBarService
  ) {
    sbService.statusChange.subscribe(status => {
      if (status.show) {
        this.loading = status.loading;
        this.message = status.message;
        this.type = status.type;
      }
      this.show = status.show;
    });
  }

  ngOnInit() {
  }

}
