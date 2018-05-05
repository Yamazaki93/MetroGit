import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SettingsComponent } from '../prototypes/settings-component';

@Component({
  selector: 'app-auth-settings',
  templateUrl: './auth-settings.component.html',
  styleUrls: ['./auth-settings.component.scss']
})
export class AuthSettingsComponent extends SettingsComponent {

  private keyPath = "";
  private pubPath = "";
  constructor(
    settings: SettingsService
  ) {
    super(settings);
  }

  getSettings() {
    this.keyPath = this.settings.getAppSetting('auth-keypath');
    this.pubPath = this.settings.getAppSetting('auth-pubpath');
  }

  browseKey() {
    this.keyPath = this.settings.browseFile();
    this.settings.setSetting('auth-keypath', this.keyPath);
  }
  browsePub() {
    this.pubPath = this.settings.browseFile();
    this.settings.setSetting('auth-pubpath', this.pubPath);
  }

}
