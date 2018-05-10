import { Component, OnInit } from '@angular/core';
import { CommitDetail } from '../prototypes/commit';
import { CommitSelectionService } from '../services/commit-selection.service';
import { CiIntegrationService } from '../services/ci-integration.service';
import { JiraIntegrationService } from '../../jira/services/jira-integration.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-commit-detail',
  templateUrl: './commit-detail.component.html',
  styleUrls: ['./commit-detail.component.scss']
})
export class CommitDetailComponent implements OnInit {

  private toggled = false;
  private loading = false;
  private fileToggled = false;
  private selectedCommit: CommitDetail = null;
  private selectedTab = "";
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
      }
    });
    selection.selectingChange.subscribe(selecting => {
      this.loading = selecting;
    });
    selection.selectedFileChange.subscribe(newFile => {
      this.fileToggled = true;
      this.layout.isFilePanelOpen = true;
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
}
