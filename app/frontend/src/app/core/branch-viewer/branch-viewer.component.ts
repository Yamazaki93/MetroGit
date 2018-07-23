import { Component, OnInit, ViewChild } from '@angular/core';
import { OpenRepoPanelComponent } from '../open-repo-panel/open-repo-panel.component';
import { ElectronService } from '../../infrastructure/electron.service';
import { RepoService } from '../services/repo.service';
import { Router } from '@angular/router';
import { LayoutService } from '../services/layout.service';
import { D3Service } from '../d3/d3.service';
import { SubmodulesService } from '../services/submodules.service';
import { SubmoduleDetailsPanelComponent } from '../submodule-details-panel/submodule-details-panel.component';
import { UpdaterService } from '../../infrastructure/updater.service';
@Component({
  selector: 'app-branch-viewer',
  templateUrl: './branch-viewer.component.html',
  styleUrls: ['./branch-viewer.component.scss']
})
export class BranchViewerComponent implements OnInit {
  toggled = true;
  nav_items: any[];
  refs = [];
  remote = [];
  local = [];
  tags = [];
  submoduleNames = [];
  repoName = "";
  branchName = "";
  branchTarget = "";
  showLocal = true;
  showRemote = true;
  showTags = true;
  showSubmodules = true;
  updateAvailable = false;
  private collapseRemote = false;
  private collapseLocal = false;
  private tooltip = true;
  @ViewChild('openRepoPanel') openRepoPanel: OpenRepoPanelComponent;
  @ViewChild('submodulePanel') submodulePanel: SubmoduleDetailsPanelComponent;
  constructor(
    private repoService: RepoService,
    private route: Router,
    private layout: LayoutService,
    private d3: D3Service,
    private submodules: SubmodulesService,
    private updater: UpdaterService
  ) {
    this.repoService.repoChange.subscribe(info => {
      let that = this;
      setTimeout(() => {
        that.repoName = info;
        that.openRepoPanel.toggled = false;
      });
    });
    this.repoService.branchChange.subscribe(currentBranch => {
      if (currentBranch) {
        this.branchName = currentBranch.name;
        this.branchTarget = currentBranch.target;
      } else {
        this.branchName = "";
        this.branchTarget = "";
      }

    });
    this.repoService.refChange.subscribe(data => {
      this.refs = data.references;
      this.updateReferences(data.references);
    });
    this.submodules.submoduleChanged.subscribe(subm => {
      this.submoduleNames = subm;
    });
    this.submodules.submoduleSelected.subscribe(name => {
      this.submodulePanel.submoduleName = name;
      this.submodulePanel.toggled = true;
    });
    this.updater.updateAvailableChange.subscribe(ava => {
      this.updateAvailable = ava;
    });
    if (this.repoService.hasRepository) {
      this.repoName = this.repoService.repoName;
      if (this.repoService.currentBranch) {
        this.branchName = this.repoService.currentBranch.name;
        this.branchTarget = this.repoService.currentBranch.target;
      }
      this.refs = this.repoService.refs;
      this.updateReferences(this.refs);
    }
    this.submoduleNames = this.submodules.submodules;
    this.toggled = layout.isNavToggled;
    this.showLocal = layout.isLocalShown;
    this.showRemote = layout.isRemoteShown;
    this.showTags = layout.isTagsShown;
    this.showSubmodules = layout.isSubmoduleShown;
    this.tooltip = layout.tooltipEnabled;
    layout.filePanelChanged.subscribe(filePanelOpen => {
      if (this.toggled && filePanelOpen) {
        this.toggleNavigation();
      }
    });
    layout.tooltipChanged.subscribe(tp => {
      this.tooltip = tp;
    });
    layout.navPanelChanged.subscribe(navOpen => {
      this.toggled = navOpen;
    });
    this.updateAvailable = this.updater.isUpdateAvailable;
  }

  ngOnInit() {
  }

  toggleNavigation(): void {
    this.toggled = !this.toggled;
    this.layout.isNavToggled = this.toggled;
  }
  toggleLocal(): void {
    this.showLocal = !this.showLocal;
    this.layout.isLocalShown = this.showLocal;
  }
  toggleRemote(): void {
    this.showRemote = !this.showRemote;
    this.layout.isRemoteShown = this.showRemote;
  }
  toggleOpenRepo(): void {
    this.openRepoPanel.toggled = !this.openRepoPanel.toggled;
  }
  toggleTags(): void {
    this.showTags = !this.showTags;
    this.layout.isTagsShown = this.showTags;
  }
  goToSettings(): void {
    if (this.updateAvailable) {
      this.route.navigateByUrl('/settings/updater');
    } else {
      this.route.navigateByUrl('/settings');
    }
  }
  goToCurrentBranch(): void {
    this.d3.scrollTo(this.branchTarget);
  }

  updateReferences(refs) {
    this.remote = [];
    this.local = [];
    this.tags = [];
    refs.forEach((r) => {
      if (r.isRemote) {
        this.remote.push(r);
      } else if (r.isBranch) {
        this.local.push(r);
      } else if (r.isTag) {
        this.tags.push(r);
      }
    });
  }
  toggleCollapseRemote($event) {
    this.collapseRemote = !this.collapseRemote;
    $event.stopPropagation();
  }
  toggleCollapseLocal($event) {
    this.collapseLocal = !this.collapseLocal;
    $event.stopPropagation();
  }
  toggleSubm() {
    this.showSubmodules = !this.showSubmodules;
    this.layout.isSubmoduleShown = this.showSubmodules;
  }
}
