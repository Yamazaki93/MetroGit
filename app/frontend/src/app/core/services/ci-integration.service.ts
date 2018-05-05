import { Injectable, EventEmitter, Output } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { RepoService } from './repo.service';
import { StatusBarService } from '../../infrastructure/status-bar.service';

@Injectable()
export class CiIntegrationService {

  @Output() buildsUpdated = new EventEmitter<any>();
  @Output() enabledChanged = new EventEmitter<boolean>();
  buildResults: any;

  enabled = false;
  private repoID = "";
  constructor(
    private electron: ElectronService,
    private status: StatusBarService,
    private repo: RepoService,
  ) {
    this.buildResults = {};
    electron.onCD('Settings-EffectiveUpdated', (event, arg) => {
      if (!arg['ci-appveyor']) {
        this.enabled = false;
      } else {
        this.enabled = true;
      }
      this.enabledChanged.emit(this.enabled);
      this.repoID = arg.currentRepo.id;
      electron.ipcRenderer.send('CI-RepoChanged', { id: this.repoID });
    });
    electron.onCD('CI-RequestError', (event, arg) => {
      this.status.flash('danger', "Failed to get CI build info. The failing service is : " + arg.service);
    });
    electron.onCD('CI-QueryBegan', (event, arg) => {
      this.status.enableLoading(`Querying CI service: ${arg.service}`);
    });
    electron.onCD('CI-BuildsRetrieved', (event, arg) => {
      this.status.disableLoading();
      let updated = {};
      arg.data.forEach(b => {
        if (this.buildResults[b.commit] && this.buildResults[b.commit].results[arg.service] !== b.status) {
          this.buildResults[b.commit].results[arg.service] = b.status;
          updated[b.commit] = this.buildResults[b.commit];
        } else if (!this.buildResults[b.commit]) {
          this.buildResults[b.commit] = {
            commit: b.commit,
            results: {},
          };
          this.buildResults[b.commit].results[arg.service] = b.status;
          updated[b.commit] = this.buildResults[b.commit];
        }
        this.updateOverallStatus(this.buildResults[b.commit]);
      });
      this.pruneOldBuilds();
      this.buildsUpdated.emit(updated);
    });
  }

  init() {

  }

  private pruneOldBuilds() {
    let first300Commits = {};
    for (let i = 0; i < 300; i++) {
      if (i < this.repo.commits.length) {
        let sha = this.repo.commits[i].sha;
        first300Commits[sha] = true;
      } else {
        break;
      }
    }
    Object.keys(this.buildResults).forEach(key => {
      if (!first300Commits[key]) {
        delete this.buildResults[key];
      }
    });
  }

  private updateOverallStatus(build) {
    let svcs = Object.keys(build.results);
    let hasQueued = false;
    let hasPass = false;
    let hasFailed = false;
    let hasCancelled = false;
    svcs.forEach(k => {
      if (build.results[k] === 'success') {
        hasPass = true;
      } else if (build.results[k] === 'queued' || build.results[k] === 'running') {
        hasQueued = true;
      } else if (build.results[k] === 'failed') {
        hasFailed = true;
      } else if (build.results[k] === 'cancelled') {
        hasCancelled = true;
      }
    });
    if (hasQueued) {
      build.overall = 'queued';
    } else if (hasFailed) {
      // no queued, has failed
      build.overall = 'failed';
    } else if (hasCancelled) {
      // no queued, no failed, has cancelled
      build.overall = 'cancelled';
    } else {
      build.overall = 'success';
    }
  }
}
