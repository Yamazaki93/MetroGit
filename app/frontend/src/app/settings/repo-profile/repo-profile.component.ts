import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../prototypes/settings-component';

@Component({
  selector: 'app-repo-profile',
  templateUrl: './repo-profile.component.html',
  styleUrls: ['./repo-profile.component.scss']
})
export class RepoProfileComponent extends SettingsComponent {

  private repoProfile = false;
  private name = "";
  private email = "";
  getSettings() {
    this.repoProfile = this.settings.getRepoSetting('use-repo-profile');
    this.name = this.settings.getRepoSetting('profile-name');
    this.email = this.settings.getRepoSetting('profile-email');
  }

  updateEnableRepoProfile(enabled) {
    this.repoProfile = enabled;
    this.settings.setRepoSetting('use-repo-profile', enabled);
    if (!enabled) {
      this.setRepoProfile(undefined, undefined);
    } else {
      this.setRepoProfile(this.name, this.email);
    }
  }

  updateProfile() {
    this.setRepoProfile(this.name, this.email);
  }

  private setRepoProfile(name, email) {
    this.settings.setRepoSetting('profile-name', name);
    this.settings.setRepoSetting('profile-email', email);
  }
}
