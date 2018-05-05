import { Injectable, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class SettingsService {

  @Output() settingsUpdated = new EventEmitter<Settings>();
  settingsData = new Settings;
  constructor(
    private electron: ElectronService,
    private noti: NotificationsService
  ) {
    this.electron.onCD('Settings-Updated', (event, arg) => {
      this.settingsData = arg.currentSettings;
      this.settingsUpdated.emit(this.settingsData);
    });
    this.electron.onCD('Secure-CacheCleared', (event, arg) => {
      this.noti.success("Credentials Cleared", "All credentials cleared! You will be prompted to enter your credentials the next time you start the app.");
    });
    this.electron.onCD('Secure-ClearCacheFailed', (event, arg) => {
      this.noti.error("Clear Credentials Failed", "Uh oh, something went wrong. Please close this app and manually clear the credentials.");
    });
  }

  init() {
    this.electron.ipcRenderer.send('Settings-Init', {});
  }
  setSetting(key, value) {
    if (this.settingsData.app_settings) {
      this.settingsData.app_settings[key] = value;
      this.electron.ipcRenderer.send('Settings-Set', this.settingsData);
    }
  }
  setRepoSetting(key, value) {
    if (this.settingsData.repo_settings) {
      this.settingsData.repo_settings[key] = value;
      this.electron.ipcRenderer.send('Settings-Set', this.settingsData);
    }
  }
  setSecureRepoSetting(key, value) {
    this.electron.ipcRenderer.send('Settings-SetSecureRepo', {key: key, value: value});
  }
  browseFile(): string {
    return this.electron.ipcRenderer.sendSync('Settings-BrowseFile', {});
  }
  getRepoSetting(key) {
    if (!this.settingsData || !this.settingsData.repo_settings || this.settingsData.repo_settings[key] === undefined) {
      return "";
    }
    return this.settingsData.repo_settings[key];
  }
  getSecureRepoSetting(key) {
    return this.electron.ipcRenderer.sendSync('Settings-GetSecureRepo', {key: key});
  }
  getAppSetting(key) {
    if (!this.settingsData || !this.settingsData.app_settings || this.settingsData.app_settings[key] === undefined) {
      return "";
    }
    return this.settingsData.app_settings[key];
  }
  clearSecureCache() {
    this.electron.ipcRenderer.send('Secure-ClearCache', {});
  }
}

class Settings {
  app_settings: Map<string, string>;
  repo_settings: Map<string, string>;
  current_repo: RepoInfo = {
    id: '',
    name: null
  };
}

interface RepoInfo {
  id: string;
  name: string;
}
