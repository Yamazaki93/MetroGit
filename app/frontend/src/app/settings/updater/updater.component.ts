import { Component, OnInit } from '@angular/core';
import { UpdaterService } from '../../infrastructure/updater.service';

@Component({
  selector: 'app-updater',
  templateUrl: './updater.component.html',
  styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent implements OnInit {

  checkingUpdate = false;
  updateAvailable = false;
  newVersion = "";
  constructor(
    private updater: UpdaterService
  ) {
    updater.updateChecking.subscribe(checking => {
      this.checkingUpdate = checking;
    });
    updater.updateAvailableChange.subscribe(ava => {
      this.updateAvailable = ava;
      if (ava) {
         this.newVersion = this.updater.updateVersion;
      }
    });
    this.updateAvailable = this.updater.isUpdateAvailable;
    this.newVersion = this.updater.updateVersion;
  }

  ngOnInit() {
  }

  checkUpdate() {
    this.updater.checkUpdate();
  }
  installUpdate() {
    this.updater.installUpdate();
  }

}
