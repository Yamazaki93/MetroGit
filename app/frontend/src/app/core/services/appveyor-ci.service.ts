import { Injectable, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { NotificationsService } from 'angular2-notifications';
import { LoadingService } from '../../infrastructure/loading-service.service';

@Injectable()
export class AppveyorCiService {

  @Output() buildsUpdated = new EventEmitter<any>();
  @Output() enabledChanged = new EventEmitter<boolean>();
  @Output() logRetrieved = new EventEmitter<{build: string, output: string}>();

  buildResults;
  enabled;
  private repoID = "";
  private account = "";
  private project = "";
  constructor(
    private electron: ElectronService,
    private notification: NotificationsService,
    private loading: LoadingService
  ) {
    electron.onCD('Settings-EffectiveUpdated', (event, arg) => {
      this.buildResults = null;
      if (!arg['ci-appveyor']) {
        this.enabled = false;
        this.account = "";
        this.project = "";
      } else {
        this.buildResults = {};
        this.project = arg['ci-appveyor-project'];
        this.account = arg['ci-appveyor-account'];
        this.enabled = true;
      }
      this.enabledChanged.emit(this.enabled);
      this.repoID = arg.currentRepo.id;
    });
    electron.onCD('CI-BuildsRetrieved', (event, arg) => {
      if (this.enabled) {
        let updated = {};
        arg.data.forEach(b => {
          if (this.buildResults[b.commit] && this.buildResults[b.commit].status !== b.status) {
            this.buildResults[b.commit] = b;
            updated[b.commit] = this.buildResults[b.commit];
          } else if (!this.buildResults[b.commit] && arg.service === 'AppVeyor') {
            this.buildResults[b.commit] = b;
            updated[b.commit] = this.buildResults[b.commit];
          }
        });
        this.buildsUpdated.emit(updated);
      }
    });
    electron.onCD('CI-AppVeyorLogNotFound', (event, arg) => {
      this.logRetrieved.emit({build: arg.version, output: "No output"});
    });
    electron.onCD('CI-AppVeyorLogRetrieved', (event, arg) => {
      this.logRetrieved.emit({build: arg.version, output: arg.result});
    });
    electron.onCD('CI-AppVeyorRebuilded', (event, arg) => {
      this.notification.success(`Rebuild Scheduled ...`);
      this.loading.disableLoading();
    });
    electron.onCD('CI-AppVeyorRebuildFailed', (event, arg) => {
      this.notification.error(`Rebuild Failed. Please try again later`);
      this.loading.disableLoading();
    });
  }

  init() {

  }

  openAppveyor(commit) {
    if (this.buildResults && this.buildResults[commit] && this.account && this.project) {
      let url = `https://ci.appveyor.com/project/${this.account}/${this.project}/build/${this.buildResults[commit].version}`;
      this.electron.ipcRenderer.send('Shell-Open', {url: url});
    }
  }

  getBuildLog(commit) {
    if (this.buildResults && this.buildResults[commit] && this.account && this.project) {
      this.electron.ipcRenderer.send('CI-AppVeyorGetLog', {version: this.buildResults[commit].version});
    }
  }

  rebuildAppveyor(commit) {
    this.loading.enableLoading('Rebuilding ...');
    this.electron.ipcRenderer.send('CI-AppVeyorRebuild', {branch: this.buildResults[commit].branch, commit: commit});
  }

}
