import { Component, OnInit } from '@angular/core';
import { RepoService } from '../services/repo.service';
import { CommitChangeService } from '../services/commit-change.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-action-toolbar',
  templateUrl: './action-toolbar.component.html',
  styleUrls: ['./action-toolbar.component.scss']
})
export class ActionToolbarComponent implements OnInit {

  pulling = false;
  pushing = false;
  stashing = false;
  popping = false;
  behind = 0;
  ahead = 0;
  tooltip = true;
  constructor(
    private repo: RepoService,
    private commit: CommitChangeService,
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
    commit.popped.subscribe(() => {
      this.popping = false;
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
    this.popping = true;
    this.commit.pop();
  }
  branch() {
    this.repo.createBranch();
  }
}
