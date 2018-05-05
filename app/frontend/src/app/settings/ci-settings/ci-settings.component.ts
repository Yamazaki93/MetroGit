import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../prototypes/settings-component';
import { SettingsService } from '../services/settings.service';
import { ElectronService } from '../../infrastructure/electron.service';

@Component({
  selector: 'app-ci-settings',
  templateUrl: './ci-settings.component.html',
  styleUrls: ['./ci-settings.component.scss']
})
export class CiSettingsComponent extends SettingsComponent {

  private appveyor = false;
  private appveyorToken = "";
  private appveyorAccount = "";
  private appveyorProject = "";

  constructor(settings: SettingsService, private electron: ElectronService) {
    super(settings);
  }
  getSettings() {
    this.appveyor = this.settings.getRepoSetting('ci-appveyor');
    this.appveyorToken = this.settings.getSecureRepoSetting('ci-appveyor-token');
    this.appveyorAccount = this.settings.getRepoSetting('ci-appveyor-account');
    this.appveyorProject = this.settings.getRepoSetting('ci-appveyor-project');
  }

  updateAppveyor(newValue: boolean) {
    this.appveyor = newValue;
    this.settings.setRepoSetting('ci-appveyor', this.appveyor);
  }

  updateAppveyorDetails() {
    this.settings.setRepoSetting('ci-appveyor-account', this.appveyorAccount);
    this.settings.setRepoSetting('ci-appveyor-project', this.appveyorProject);
  }
  updateAppveyorToken() {
    this.settings.setSecureRepoSetting('ci-appveyor-token', this.appveyorToken);
  }
  openHelp() {
    this.electron.openUrlExternal('https://ci.appveyor.com/api-token');
  }
}
