import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings/services/settings.service';
import { RepoService } from './core/services/repo.service';
import { CiIntegrationService } from './core/services/ci-integration.service';
import { D3Service } from './core/d3/d3.service';
import { AppveyorCiService } from './core/services/appveyor-ci.service';
import { CredentialsService } from './core/services/credentials.service';
import { UpdaterService } from './infrastructure/updater.service';
import { CommitChangeService } from './core/services/commit-change.service';
import { CacheService } from './infrastructure/cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private settings: SettingsService, private repo: RepoService, private ci: CiIntegrationService, private d3: D3Service,
  private appveyor: AppveyorCiService, private cred: CredentialsService, private updater: UpdaterService, private commitChange: CommitChangeService,
  private cache: CacheService) {
  }

  ngOnInit() {
    this.repo.init();
    this.cred.init();
    this.updater.init();
    this.ci.init();
    this.appveyor.init();
    this.d3.init();
    this.commitChange.init();
    this.settings.init();
    this.cache.init();
  }
}
