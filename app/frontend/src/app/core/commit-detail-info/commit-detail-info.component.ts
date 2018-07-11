import { Component, OnInit, Sanitizer, Input, Output, EventEmitter, ViewChild, AfterViewChecked } from '@angular/core';
import { D3Service } from '../d3/d3.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommitDetail, WIPCommit } from '../prototypes/commit';
import { CommitSelectionService } from '../services/commit-selection.service';
import { CommitChangeService } from '../services/commit-change.service';
import { LayoutService } from '../services/layout.service';
import { CommitFileListComponent } from '../commit-file-list/commit-file-list.component';
import { Subscription } from 'rxjs/Subscription';
import { FileCountsComponent } from '../file-counts/file-counts.component';

@Component({
  selector: 'app-commit-detail-info',
  templateUrl: './commit-detail-info.component.html',
  styleUrls: ['./commit-detail-info.component.scss']
})
export class CommitDetailInfoComponent implements OnInit, AfterViewChecked {

  @Input() set fileViewMode(m: string) {
    this._mode = m;
  }
  @Input() set commit(cmt) {
    this._commit = cmt;

  }
  get commit() {
    return this._commit;
  }
  @ViewChild('commitFilesList') commitFilesList: CommitFileListComponent;
  @ViewChild('commitFileCounts') commitFileCounts: FileCountsComponent;
  private committing = false;
  private set newCommitMessage(msg) {
    this._message = msg;
    this.setCommitMessages();
  }
  private get newCommitMessage() {
    return this._message;
  }
  private set newCommitDetail(msg) {
    this._detail = msg;
    this.setCommitMessages();
  }
  private get newCommitDetail() {
    return this._detail;
  }
  private _message = "";
  private _detail = "";
  private _mode = "";
  private tooltip = true;
  private _commit: CommitDetail | WIPCommit;
  private _fileSelectSub: Subscription;
  private _filterModifiedSub: Subscription;
  private _filterAddedSub: Subscription;
  private _filterDeletedSub: Subscription;
  private _filterRenamedSub: Subscription;
  constructor(
    private d3: D3Service,
    private sanitize: DomSanitizer,
    private selection: CommitSelectionService,
    private commitChange: CommitChangeService,
    private layout: LayoutService
  ) {
    this.newCommitMessage = this.commitChange.newCommitMessage;
    this.newCommitDetail = this.commitChange.newCommitDetail;
    this.commitChange.messageChange.subscribe(msg => {
      this._message = msg;
    });
    this.commitChange.detailChange.subscribe(det => {
      this._detail = det;
    });
    this.commitChange.commitingChange.subscribe(cmting => {
      this.committing = cmting;
    });
    layout.tooltipChanged.subscribe(tp => {
      this.tooltip = tp;
    });
    this.tooltip = layout.tooltipEnabled;
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.commitFilesList) {
      if (this._fileSelectSub) {
        this._fileSelectSub.unsubscribe();
      }
      this._fileSelectSub = this.commitFilesList.fileSelected.subscribe(path => {
        this.openFileDetails(path);
      });
    }
    if (this.commitFileCounts && this.commitFilesList) {
      if (this._filterAddedSub) {
        this._filterAddedSub.unsubscribe();
      }
      this._filterAddedSub = this.commitFileCounts.newClicked.subscribe(() => {
        this.commitFilesList.applyFilter(true, false, false, false);
      });
      if (this._filterModifiedSub) {
        this._filterModifiedSub.unsubscribe();
      }
      this._filterModifiedSub = this.commitFileCounts.modifiedClicked.subscribe(() => {
        this.commitFilesList.applyFilter(false, false, true, false);
      });
      if (this._filterDeletedSub) {
        this._filterDeletedSub.unsubscribe();
      }
      this._filterDeletedSub = this.commitFileCounts.deletedClicked.subscribe(() => {
        this.commitFilesList.applyFilter(false, true, false, false);
      });
      if (this._filterRenamedSub) {
        this._filterRenamedSub.unsubscribe();
      }
      this._filterRenamedSub = this.commitFileCounts.renamedClicked.subscribe(() => {
        this.commitFilesList.applyFilter(false, false, false, true);
      });
    }
  }
  getShortenedPath(path) {
    if (path.length > 65) {
      let front = path.substring(0, 20);
      let over = path.length - 65 - 3;
      let back = path.substring(20 + over, path.length);
      return `${front}...${back}`;
    } else {
      return path;
    }
  }

  wipFileTrack(index, item) {
    return item.path;
  }
  stageAll() {
    if (this.commit.virtual && (<WIPCommit>this.commit).unstaged.length) {
      let unstagedPaths = (<WIPCommit>this.commit).unstaged.map(s => s.path);
      this.commitChange.stage(unstagedPaths);
    }
  }
  setCommitMessages() {
    this.commitChange.newCommitMessage = this.newCommitMessage;
    this.commitChange.newCommitDetail = this.newCommitDetail;
  }
  unstageAll() {
    if (this.commit.virtual && (<WIPCommit>this.commit).staged.length) {
      let stagedPaths = (<WIPCommit>this.commit).staged.map(s => s.path);
      this.commitChange.unstage(stagedPaths);
    }
  }
  stage(file, $event) {
    this.commitChange.stage([file]);
    $event.stopPropagation();
  }
  unstage(file, $event) {
    this.commitChange.unstage([file]);
    $event.stopPropagation();
  }
  discardAll() {
    this.commitChange.discardAll();
  }
  commitChanges() {
    this.commitChange.tryCommit();
  }
  fillKeyIfNeeded() {
    if (this._message.length === 0 && this.commitChange.defaultKey) {
      this.newCommitMessage = this.commitChange.defaultKey + '-';
    }
  }
  openFileDetails(file, commit = null) {
    this.selection.selectFileDetail(file, commit, this._mode === 'file');
  }
  onKeyDown($event) {
    // keyboard code 83 = s;
    if ($event.keyCode === 83 && $event.ctrlKey) {
      this.commitChange.tryCommit();
    }
  }
}
