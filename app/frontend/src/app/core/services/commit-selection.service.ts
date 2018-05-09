import { Injectable, EventEmitter, Output } from '@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { CommitDetail, WIPCommit } from '../prototypes/commit';
import { CiIntegrationService } from './ci-integration.service';

@Injectable()
export class CommitSelectionService {

  @Output() selectionChange = new EventEmitter<CommitDetail | WIPCommit>();
  @Output() selectingChange = new EventEmitter<boolean>();

  selectedCommit: CommitDetail | WIPCommit;
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
  };
  constructor(
    private electron: ElectronService,
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
  reset(commit, mode): void {
    if (mode === 'hard') {
      this.electron.ipcRenderer.send('Repo-ResetHard', { commit: commit });
    } else if (mode === 'soft') {
      this.electron.ipcRenderer.send('Repo-ResetSoft', { commit: commit });
    }
  }

}
