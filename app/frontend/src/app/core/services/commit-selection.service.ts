import { Injectable, EventEmitter, Output } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { CommitDetail, WIPCommit } from '../prototypes/commit';
import { CiIntegrationService } from './ci-integration.service';
import { FileDetail } from '../prototypes/file-detail';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { TagPromptComponent } from '../tag-prompt/tag-prompt.component';
import { NotificationsService } from 'angular2-notifications';
import { CredentialsService } from './credentials.service';

@Injectable()
export class CommitSelectionService {

  @Output() selectionChange = new EventEmitter<CommitDetail | WIPCommit>();
  @Output() selectingChange = new EventEmitter<boolean>();
  @Output() selectedFileChange = new EventEmitter<string>();
  @Output() fileDetailChanged = new EventEmitter<FileDetail>();
  @Output() gettingFileDetail = new EventEmitter();

  selectedCommit: CommitDetail | WIPCommit;
  private _selectedFile = "";
  private _fileDetail: FileDetail;
  private _currentUpdateSubscription = "";
  private _wipDetail: WIPCommit = {
    sha: "00000",
    author: "",
    email: "",
    parents: [],
    message: "",
    date: new Date(),
    ci: "",
    staged: null,
    unstaged: null,
    stagedSummary: {
      ignored: 0,
      newCount: 0,
      deleted: 0,
      modified: 0,
      renamed: 0,
    },
    unstagedSummary: {
      ignored: 0,
      newCount: 0,
      deleted: 0,
      modified: 0,
      renamed: 0,
    },
    virtual: true,
    isStash: false,
    stashIndex: -1,
  };
  constructor(
    private electron: ElectronService,
    private promptInj: PromptInjectorService,
    private noti: NotificationsService,
    private cred: CredentialsService
  ) {
    this.electron.onCD('Repo-CommitDetailRetrieved', (event, arg) => {
      this.selectedCommit = arg.commit;

      this.selectingChange.emit(false);
      this.selectionChange.emit(this.selectedCommit);
    });
    this.electron.onCD('Repo-FileStatusRetrieved', (event, arg) => {
      this._wipDetail.stagedSummary = arg.stagedSummary;
      this._wipDetail.unstagedSummary = arg.unstagedSummary;
      this._wipDetail.staged = arg.staged;
      this._wipDetail.unstaged = arg.unstaged;
      if (!this._wipDetail.staged.length && !this._wipDetail.unstaged.length && this.selectedCommit && this.selectedCommit.sha === '00000') {
        this.selectedCommit = null;
        this.selectionChange.emit(this.selectedCommit);
      }
    });
    this.electron.onCD('Repo-FileDetailRetrieved', (event, arg) => {
      this._fileDetail = arg;
      this.fileDetailChanged.emit(this._fileDetail);
    });
    this.electron.onCD('Repo-BranchDeleted', (event, arg) => {
      if (arg.upstream) {
        let notification = this.noti.info("Upstream Branch Found", "Local branch deleted. Click here to delete the upstream branch");
        notification.click.subscribe(() => {
          this.deleteRemoteBranch(arg.upstream);
        });
      }
    });
    this.electron.onCD('Repo-BranchDeleteFailed', (event, arg) => {
      if (arg.detail === 'IS_CURRENT_BRANCH') {
        this.noti.error("Current Branch", "You are trying to delete the current branch, please checkout another branch before deleting");
      }
    });
    this.electron.onCD('Repo-LiveUpdateFileNotFound', (event, arg) => {
      this._selectedFile = "";
      this.selectedFileChange.emit(this._selectedFile);
    });
    this.electron.onCD('Repo-Closed', (event, arg) => {
      this.selectedCommit = null;
      this.selectionChange.emit(this.selectedCommit);
    });

    this.electron.onCD('Repo-OpenSuccessful', (event, arg) => {
      this.selectedCommit = null;
      this.selectionChange.emit(this.selectedCommit);
    });
  }

  selectFileDetail(file, sha = null, fullFile = false) {
    if (!sha) {
      sha = this.selectedCommit.sha;
    }
    this._selectedFile = file;
    this.selectedFileChange.emit(file);
    this.gettingFileDetail.emit();
    this.electron.ipcRenderer.send('Repo-GetFileDetail', { file: file, commit: sha, fullFile: fullFile });
    this.subscribeLiveFileUpdate(file, sha, fullFile);
  }
  subscribeLiveFileUpdate(file, commit, fullFile) {
    this.unsubscribeFileUpdate();
    this._currentUpdateSubscription = this.electron.ipcRenderer.sendSync('Repo-SubscribeFileUpdate', {file: file, commit: commit, fullFile: fullFile});
  }
  select(commit) {
    if (commit && (!this.selectedCommit || commit !== this.selectedCommit.sha)) {
      if (commit === '00000') {
        this.selectedCommit = this._wipDetail;
        this.selectionChange.emit(this.selectedCommit);
      } else {
        this.selectingChange.emit(true);
        this.electron.ipcRenderer.send('Repo-GetCommit', { commit: commit });
      }
    } else if (!commit || (this.selectedCommit && commit === this.selectedCommit.sha)) {
      this.selectedCommit = null;
      this.selectionChange.emit(this.selectedCommit);
    }
  }
  openExternalFileView(file, sha = null) {
    if (!sha) {
      sha = this.selectedCommit.sha;
    }
    this.electron.ipcRenderer.send('Repo-OpenExternalFile', { file: file, commit: sha });
  }
  reset(commit, mode): void {
    if (mode === 'hard') {
      this.electron.ipcRenderer.send('Repo-ResetHard', { commit: commit });
    } else if (mode === 'soft') {
      this.electron.ipcRenderer.send('Repo-ResetSoft', { commit: commit });
    }
  }
  createTag(commit): void {
    let compt = this.promptInj.injectComponent(TagPromptComponent);
    compt.sha = commit;
    compt.toCreate.subscribe(info => {
      this.electron.ipcRenderer.send('Repo-CreateTag', { targetCommit: info.sha, name: info.name });
    });
  }
  deleteTag(name): void {
    this.electron.ipcRenderer.send('Repo-DeleteTag', { name: name });
  }
  deleteBranch(name): void {
    this.electron.ipcRenderer.send('Repo-DeleteBranch', {name: name});
  }
  deleteRemoteBranch(name): void {
    let username = this.cred.username;
    let password = this.cred.password;
    this.electron.ipcRenderer.send('Repo-DeleteBranch', {name: name, username: username, password: password});
  }
  unsubscribeFileUpdate(): void {
    this.electron.ipcRenderer.send('Repo-UnsubscribeFileUpdate', {id: this._currentUpdateSubscription});
  }
}
