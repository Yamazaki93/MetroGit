import { Injectable, EventEmitter, Output } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { CommitDetail, WIPCommit } from '../prototypes/commit';
import { CiIntegrationService } from './ci-integration.service';
import { FileDetail } from '../prototypes/file-detail';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { TagPromptComponent } from '../tag-prompt/tag-prompt.component';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class CommitSelectionService {

  @Output() selectionChange = new EventEmitter<CommitDetail | WIPCommit>();
  @Output() selectingChange = new EventEmitter<boolean>();
  @Output() selectedFileChange = new EventEmitter<string>();
  @Output() fileDetailChanged = new EventEmitter<FileDetail>();

  selectedCommit: CommitDetail | WIPCommit;
  private _selectedFile = "";
  private _fileDetail: FileDetail;
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
  }

  selectFileDetail(file, sha = null) {
    if (!sha) {
      sha = this.selectedCommit.sha;
    }
    this._selectedFile = file;
    this.selectedFileChange.emit(file);
    this.electron.ipcRenderer.send('Repo-GetFileDetail', { file: file, commit: sha });
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
  openExternalFileView(file) {
    this.electron.ipcRenderer.send('Repo-OpenExternalFile', { file: file, commit: this.selectedCommit.sha });
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
}
