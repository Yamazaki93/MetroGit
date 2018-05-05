import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.scss']
})
export class SettingsNavComponent implements OnInit {

  private repoName: string = null;
  constructor(
    private route: Router,
    private settings: SettingsService
  ) {
    settings.settingsUpdated.subscribe(val => {
      this.repoName = val.current_repo.name;
    });
    if (this.settings.settingsData.current_repo) {
      this.repoName = settings.settingsData.current_repo.name;
    }
  }

  ngOnInit() {
  }
  goToGitView() {
    this.route.navigateByUrl('/');
  }

}
