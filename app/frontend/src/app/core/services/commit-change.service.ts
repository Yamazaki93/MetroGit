import { Injectable, EventEmitter, Output } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { CredentialsService } from './credentials.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Injectable()
export class CommitChangeService {

  @Output() messageChange = new EventEmitter<string>();
  @Output() detailChange = new EventEmitter<string>();
  @Output() stashed = new EventEmitter();
  defaultKey = "";
  set newCommitMessage(msg) {
    this._message = msg;
    this.messageChange.emit(this._message);
  }
  get newCommitMessage() {
    return this._message;
  }
  set newCommitDetail(msg) {
    this._detail = msg;
    this.detailChange.emit(this._detail);
  }
  get newCommitDetail() {
    return this._detail;
  }
  private _message = "";
  private _detail = "";
  constructor(
    private electron: ElectronService,
    private cred: CredentialsService,
    private route: Router,
    private noti: NotificationsService
  ) {
    this.electron.onCD('Repo-Committed', (event, arg) => {
      this.newCommitMessage = "";
      this.newCommitDetail = "";
    });
    this.electron.onCD('Repo-CommitFail', (event, arg) => {
      this.noti.error("Commit Error", "An error occured during commit, please try again");
    });
    this.electron.onCD('Settings-EffectiveUpdated', (event, arg) => {
      if (arg['jira-enabled'] && arg['jira-keys']) {
        let keys = arg['jira-keys'].split(';');
        let key = "";
        if (keys.length) {
          key = keys[0];
        }
        this.defaultKey = key;
      } else {
        this.defaultKey = "";
      }
    });
    this.electron.onCD('Repo-StashFailed', (event, arg) => {
      this.noti.error("Stash Error", "There was an error during stash, please try again");
      this.stashed.emit();
    });
    this.electron.onCD('Repo-PopFailed', (event, arg) => {
      if (arg.detail === 'NO_STASH') {
        this.noti.info("No Stash", "There's no stashed commits");
      } else {
        this.noti.error("Pop Error", "There was an error during pop, please try again");
      }
    });
    this.electron.onCD('Repo-Stashed', (event, arg) => {
      this.stashed.emit();
    });
  }
  stage(paths): void {
    this.electron.ipcRenderer.send('Repo-Stage', { paths: paths });
  }
  unstage(paths): void {
    this.electron.ipcRenderer.send('Repo-Unstage', { paths: paths });
  }
  commit(paths): void {
    if (this.checkProfileExists()) {
      let name = this.cred.name;
      let email = this.cred.email;
      let message = `${this._message}\n${this.newCommitDetail}`;
      this.electron.ipcRenderer.send('Repo-Commit', { name: name, email: email, message: message, files: paths });
    }
  }
  commitStaged(): void {
    if (this.checkProfileExists()) {
      let name = this.cred.name;
      let email = this.cred.email;
      let message = `${this._message}\n${this.newCommitDetail}`;
      this.electron.ipcRenderer.send('Repo-CommitStaged', { name: name, email: email, message: message });
    }
  }
  stash(): void {
    if (this.checkProfileExists()) {
      let name = this.cred.name;
      let email = this.cred.email;
      let message = `${this._message}\n${this.newCommitDetail}`;
      this.electron.ipcRenderer.send('Repo-Stash', { name: name, email: email, message: message });
    }
  }
  pop(): void {
    this.electron.ipcRenderer.send('Repo-Pop', {});
  }
  discardAll(): void {
    this.electron.ipcRenderer.send('Repo-DiscardAll', {});
  }
  private checkProfileExists(): boolean {
    let noProfile = !this.cred.name || !this.cred.email;
    if (noProfile) {
      let notification = this.noti.warn("Profile Not Setup", "No profile settings found, click here to setup your profile");
      notification.click.subscribe(() => {
        this.route.navigateByUrl('settings/profile');
      });
    }
    return !noProfile;
  }
}
