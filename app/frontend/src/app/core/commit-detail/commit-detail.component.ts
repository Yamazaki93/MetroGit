import { Component, OnInit, ViewChild } from '@angular/core';
import { CommitDetail } from '../prototypes/commit';
import { CommitSelectionService } from '../services/commit-selection.service';
import { CiIntegrationService } from '../services/ci-integration.service';
import { JiraIntegrationService } from '../../jira/services/jira-integration.service';
import { LayoutService } from '../services/layout.service';
import { FileDetail } from '../prototypes/file-detail';
import { FileViewPanelComponent } from '../file-view-panel/file-view-panel.component';

@Component({
  selector: 'app-commit-detail',
  templateUrl: './commit-detail.component.html',
  styleUrls: ['./commit-detail.component.scss']
})
export class CommitDetailComponent implements OnInit {

  toggled = false;
  fileToggled = false;
  private loading = false;
  private selectedCommit: CommitDetail = null;
  private selectedTab = "";
  private selectedFile = "";
  private fileDetail: FileDetail;
  private set fileViewMode(m: string) {
    this._mode = m;
  }
  private get fileViewMode() {
    return this._mode;
  }
  private _mode = 'hunk';
  constructor(
    private selection: CommitSelectionService,
    private ci: CiIntegrationService,
    private jira: JiraIntegrationService,
    private layout: LayoutService,
  ) {
    selection.selectionChange.subscribe(newSelect => {
      this.selectedCommit = newSelect;
      if (this.selectedCommit) {
        this.toggled = true;
        if (!this.selectedTab) {
          this.selectedTab = 'info';
        }
      } else {
        this.toggled = false;
        this.selectedTab = "";
        this.closeFilePanel();
        this.layout.isDetailPanelOpen = false;
      }
    });
    selection.selectingChange.subscribe(selecting => {
      this.loading = selecting;
    });
    selection.selectedFileChange.subscribe(newFile => {
      this.selectedFile = newFile;
      if (newFile) {
        this.fileToggled = true;
        this.layout.isFilePanelOpen = true;
      } else {
        this.fileToggled = false;
        this.layout.isFilePanelOpen = false;
        this.selection.unsubscribeFileUpdate();
      }
    });
    selection.fileDetailChanged.subscribe(newdetail => {
      this.fileDetail = newdetail;
    });
  }

  ngOnInit() {
  }

  toggleDetail(): void {
    this.toggled = !this.toggled;
    this.layout.isDetailPanelOpen = this.toggled;
  }

  goTo(tab): void {
    this.selectedTab = tab;
  }
  closeFilePanel() {
    this.fileToggled = false;
    this.layout.isFilePanelOpen = this.fileToggled;
  }
  openExternal(commit) {
    this.selection.openExternalFileView(this.selectedFile, commit);
  }
  getShortenedPath(path) {
    if (path.length > 55) {
      let front = path.substring(0, 20);
      let over = path.length - 55 - 3;
      let back = path.substring(20 + over, path.length);
      return `${front}...${back}`;
    } else {
      return path;
    }
  }
}
