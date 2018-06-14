import { Component, OnInit } from '@angular/core';
import { RepoService } from '../services/repo.service';
import { CredentialsService } from '../services/credentials.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { CommitChangeService } from '../services/commit-change.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-action-toolbar',
  templateUrl: './action-toolbar.component.html',
  styleUrls: ['./action-toolbar.component.scss']
})
export class ActionToolbarComponent implements OnInit {

  private pulling = false;
  private pushing = false;
  private stashing = false;
  private behind = 0;
  private ahead = 0;
  private tooltip = true;
  constructor(
    private repo: RepoService,
    private cred: CredentialsService,
    private noti: NotificationsService,
    private commit: CommitChangeService,
    private route: Router,
    private layout: LayoutService,
  ) {
    repo.pulling.subscribe(state => {
      this.pulling = state;
    });
    repo.pushing.subscribe(state => {
      this.pushing = state;
    });
    repo.posUpdate.subscribe(pos => {
      this.behind = pos.behind;
      this.ahead = pos.ahead;
    });
    commit.stashed.subscribe(() => {
      this.stashing = false;
    });
    layout.tooltipChanged.subscribe(tp => {
      this.tooltip = tp;
    });
    this.tooltip = layout.tooltipEnabled;
  }

  ngOnInit() {
  }

  pull() {
    this.repo.pull();
  }
  push() {
    this.repo.push();
  }
  stash() {
    this.stashing = true;
    this.commit.stash();
  }
  pop() {
    this.commit.pop();
  }
  branch() {
    this.repo.createBranch();
  }
}
