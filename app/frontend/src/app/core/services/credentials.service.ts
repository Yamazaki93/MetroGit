import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { EnterLoginPromptComponent } from '../enter-login-prompt/enter-login-prompt.component';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { SshPasswordPromptComponent } from '../ssh-password-prompt/ssh-password-prompt.component';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';

@Injectable()
export class CredentialsService {

  username = "";
  password = "";
  email = "";
  name = "";
  credentialChange = new EventEmitter<{ username: string, password: string }>();
  constructor(
    private electron: ElectronService,
    private promptIj: PromptInjectorService,
    private noti: NotificationsService,
    private route: Router
  ) {
    this.electron.onCD('Repo-OpenSuccessful', (event, arg) => {
      this.username = "";
      this.password = "";
      this.email = "";
      this.name = "";
    });
    this.electron.onCD('Settings-EffectiveUpdated', (event, arg) => {
      this.email = arg['profile-email'];
      this.name = arg['profile-name'];
    });
    this.electron.onCD('Repo-UsernameRetrieved', (event, arg) => {
      this.username = arg.username;
      this.notifyCredentialChange();
    });
    this.electron.onCD('Repo-PasswordRetrieved', (event, arg) => {
      this.password = arg.password;
      this.notifyCredentialChange();
    });
    this.electron.onCD('Repo-SSHKeyRequired', (event, arg) => {
      let notification = this.noti.warn("SSH Key Required", "This repo uses SSH authentication, click here to set up your SSH keys", { clickToClose: true });
      notification.click.subscribe(() => {
        this.route.navigateByUrl('settings/auth');
      });
    });
  }

  init() {

  }

  promptUserUpdateCredential() {
    let component = this.promptIj.injectComponent(EnterLoginPromptComponent);
    (<EnterLoginPromptComponent>component).onEnter.subscribe(creds => {
      this.username = creds.username;
      this.password = creds.password;
      this.updateCredentials(creds.username, creds.password);
      this.notifyCredentialChange();
    });
  }

  promptUserEnterSSHPassword() {
    let component = this.promptIj.injectComponent(SshPasswordPromptComponent);
    (<SshPasswordPromptComponent>component).onEnter.subscribe(creds => {
      this.password = creds.password;
      this.updateCredentials("", creds.password);
      this.notifyCredentialChange();
    });
  }

  notifyCredentialChange() {
    this.credentialChange.emit({ username: this.username, password: this.password });
  }

  updateCredentials(username, password) {
    this.electron.ipcRenderer.send('Repo-SetCred', { username: username, password: password });
  }
}
