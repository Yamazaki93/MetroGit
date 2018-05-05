import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../prototypes/settings-component';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent extends SettingsComponent {

  private email = "";
  private name = "";
  getSettings() {
    this.email = this.settings.getAppSetting('profile-email');
    this.name = this.settings.getAppSetting('profile-name');
  }
  updateSettings() {
    this.settings.setSetting('profile-email', this.email);
    this.settings.setSetting('profile-name', this.name);
  }
}
