import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../prototypes/settings-component';
import { SettingsService } from '../services/settings.service';
import { ElectronService } from '../../infrastructure/electron.service';

@Component({
  selector: 'app-jira-settings',
  templateUrl: './jira-settings.component.html',
  styleUrls: ['./jira-settings.component.scss']
})
export class JiraSettingsComponent extends SettingsComponent {

  jira = false;
  jiraToken = "";
  jiraAddress = "";
  jiraKeys = [];
  jiraUsername = "";
  private jiraKeyInput = "";
  constructor(
    settings: SettingsService,
    private electron: ElectronService
  ) {
    super(settings);
  }

  getSettings() {
    this.jira = this.settings.getRepoSetting('jira-enabled');
    this.jiraToken = this.settings.getSecureRepoSetting('jira-token');
    this.jiraAddress = this.settings.getRepoSetting('jira-address');
    this.jiraUsername = this.settings.getRepoSetting('jira-username');
    let keysString = this.settings.getRepoSetting('jira-keys');
    if (keysString) {
      this.jiraKeys = keysString.split(';').map(k => ({value: k, display: k}));
    }
  }

  updateJira(newValue: boolean) {
    this.jira = newValue;
    this.settings.setRepoSetting('jira-enabled', this.jira);
  }
  updateToken() {
    this.settings.setSecureRepoSetting('jira-token', this.jiraToken);
  }
  updateSettings() {
    this.settings.setRepoSetting('jira-address', this.jiraAddress);
    this.settings.setRepoSetting('jira-username', this.jiraUsername);
  }
  updateJiraKeys() {
    let keysString = this.jiraKeys.map(k => k.value).join(';');
    this.settings.setRepoSetting('jira-keys', keysString);
  }
  upperCase(str: string) {
    this.jiraKeyInput = str.toUpperCase();
  }
  openHelp() {
    this.electron.openUrlExternal('https://confluence.atlassian.com/cloud/api-tokens-938839638.html');
  }
}
