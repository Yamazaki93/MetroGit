import { Component, OnInit, Input } from '@angular/core';
import { CommitDetail } from '../prototypes/commit';
import { CiIntegrationService } from '../services/ci-integration.service';
import { AppveyorCiService } from '../services/appveyor-ci.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-commit-detail-ci',
  templateUrl: './commit-detail-ci.component.html',
  styleUrls: ['./commit-detail-ci.component.scss']
})
export class CommitDetailCiComponent implements OnInit {


  private commit: CommitDetail;
  private showAppveyor = false;
  private appveyorOutput = "";
  private loadingAppveyor = false;
  private tooltip = true;

  @Input() set selectedCommit(cmt: CommitDetail) {
    this.commit = cmt;
    if (this.commit && this.ci.buildResults[this.commit.sha]) {
      this.updateBuildResult(this.ci.buildResults[this.commit.sha]);
    }
    this.checkGetAppveyorLog();
  }
  constructor(
    private ci: CiIntegrationService,
    private appveyor: AppveyorCiService,
    private layout: LayoutService
  ) {
    ci.buildsUpdated.subscribe(builds => {
      if (this.commit && builds[this.commit.sha]) {
        this.updateBuildResult(builds[this.commit.sha]);
        this.checkGetAppveyorLog();
      }
    });
    appveyor.logRetrieved.subscribe(log => {
      this.loadingAppveyor = false;
      this.appveyorOutput = log.output;
    });
    layout.tooltipChanged.subscribe(tp => {
      this.tooltip = tp;
    });
    this.tooltip = layout.tooltipEnabled;
  }

  updateBuildResult(result) {
    this.commit.ci = result.overall;
  }
  ngOnInit() {

  }

  getStatusText(status) {
    let result = "Unknown";
    if (status === 'success') {
      result = "Pass";
    } else if (status === 'failed') {
      result = "Failed, at lease 1 CI report build failed";
    } else if (status === 'queued') {
      result = "Queued, a build is queued or running";
    } else if (status === 'cancelled') {
      result = "Cancelled, the last build was cancelled";
    }
    return result;
  }

  getStatusShort(status) {
    let result = "Unknown";
    if (status === 'success') {
      result = "Pass";
    } else if (status === 'failed') {
      result = "Failed";
    } else if (status === 'queued') {
      result = "Queued";
    } else if (status === 'cancelled') {
      result = "Cancelled";
    }
    return result;
  }
  toggleAppveyor() {
    this.showAppveyor = !this.showAppveyor;
    this.checkGetAppveyorLog();
  }
  openAppveyor($event) {
    this.appveyor.openAppveyor(this.commit.sha);
    $event.stopPropagation();
  }
  rebuildAppveyor($event) {
    this.appveyor.rebuildAppveyor(this.commit.sha);
    $event.stopPropagation();
  }
  checkGetAppveyorLog() {
    if (this.appveyor.enabled && this.showAppveyor && this.appveyor.buildResults && this.appveyor.buildResults[this.commit.sha]) {
      this.loadingAppveyor = true;
      if (this.appveyor.buildResults[this.commit.sha].status !== 'queued') {
        this.appveyor.getBuildLog(this.commit.sha);
      }
    }
  }

}
