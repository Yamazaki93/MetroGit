import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../prototypes/settings-component';

@Component({
  selector: 'app-repo-profile',
  templateUrl: './repo-profile.component.html',
  styleUrls: ['./repo-profile.component.scss']
})
export class RepoProfileComponent extends SettingsComponent {

  private repoProfile = false;

  getSettings() {
    this.repoProfile = this.settings.getRepoSetting('use-repo-profile');
  }

  updateEnableRepoProfile(enabled) {
    this.repoProfile = enabled;
  }
}
