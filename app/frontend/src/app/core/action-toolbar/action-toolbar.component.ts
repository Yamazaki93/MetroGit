import { Component, OnInit } from '@angular/core';
import { RepoService } from '../services/repo.service';
import { CredentialsService } from '../services/credentials.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { CommitChangeService } from '../services/commit-change.service';

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
  constructor(
    private repo: RepoService,
    private cred: CredentialsService,
    private noti: NotificationsService,
    private commit: CommitChangeService,
    private route: Router
  ) {
    repo.pulled.subscribe(() => {
      this.pulling = false;
    });
    repo.pushed.subscribe(() => {
      this.pushing = false;
    });
    repo.posUpdate.subscribe(pos => {
      this.behind = pos.behind;
      this.ahead = pos.ahead;
    });
    commit.stashed.subscribe(() => {
      this.stashing = false;
    });
  }

  ngOnInit() {
  }

  pull() {
    this.pulling = true;
    this.repo.pull();
  }
  push() {
    this.pushing = true;
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
