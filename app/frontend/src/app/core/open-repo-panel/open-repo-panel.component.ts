import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { RepoService } from '../services/repo.service';
import { HistoryService } from '../services/history.service';

@Component({
  selector: 'app-open-repo-panel',
  templateUrl: './open-repo-panel.component.html',
  styleUrls: ['./open-repo-panel.component.scss']
})
export class OpenRepoPanelComponent implements OnInit {

  @Input() toggled = false;
  private history = [];
  constructor(
    private repoService: RepoService,
    private repoHistory: HistoryService
  ) { }

  ngOnInit() {
    this.repoHistory.historyChange.subscribe(repos => {
      this.history = repos;
    });
    this.history = this.repoHistory.repos;
  }

  openBrowseDialog() {
    this.repoService.openBrowse();
  }
  openRepo(workingDir) {
    this.repoService.openRepo(workingDir);
  }
}
