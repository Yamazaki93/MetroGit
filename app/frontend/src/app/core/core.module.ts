import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BranchViewerComponent } from './branch-viewer/branch-viewer.component';
import { GitViewComponent } from './git-view/git-view.component';
import { SubwayComponent } from './subway/subway.component';
import { SubwayStationsComponent } from './subway-stations/subway-stations.component';
import { D3Service } from './d3/d3.service';
import { SubwayMapVisualComponent } from './visuals/subway/subway-map-visual/subway-map-visual.component';
import { NodeVisualComponent } from './visuals/shared/node-visual/node-visual.component';
import { LinkVisualComponent } from './visuals/shared/link-visual/link-visual.component';
import { SubwayStationAnnotComponent } from './subway-station-annot/subway-station-annot.component';
import { RepoService } from './services/repo.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionToolbarComponent } from './action-toolbar/action-toolbar.component';
import { OpenRepoPanelComponent } from './open-repo-panel/open-repo-panel.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { LayoutService } from './services/layout.service';
import { PromptComponent } from './prompt/prompt.component';
import { EnterLoginPromptComponent } from './enter-login-prompt/enter-login-prompt.component';
import { PromptContainerDirective } from './prompt/prompt-container.directive';
import { CredentialsService } from './services/credentials.service';
import { FormsModule } from '@angular/forms';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchItemComponent } from './branch-item/branch-item.component';
import { SshPasswordPromptComponent } from './ssh-password-prompt/ssh-password-prompt.component';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { CiIntegrationService } from './services/ci-integration.service';
import { CommitDetailComponent } from './commit-detail/commit-detail.component';
import { CommitSelectionService } from './services/commit-selection.service';
import { CommitDetailInfoComponent } from './commit-detail-info/commit-detail-info.component';
import { JiraModule } from '../jira/jira.module';
import { CommitDetailCiComponent } from './commit-detail-ci/commit-detail-ci.component';
import { AppveyorCiService } from './services/appveyor-ci.service';
import { CiConsoleOutputComponent } from './ci-console-output/ci-console-output.component';
import { ForcePushPromptComponent } from './force-push-prompt/force-push-prompt.component';
import { CommitChangeService } from './services/commit-change.service';
import { CreateBranchPromptComponent } from './create-branch-prompt/create-branch-prompt.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FileViewPanelComponent } from './file-view-panel/file-view-panel.component';
import { ExternalFileViewerComponent } from './external-file-viewer/external-file-viewer.component';
import { TagPromptComponent } from './tag-prompt/tag-prompt.component';
import { MapSeparatorComponent } from './map-separator/map-separator.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { SubmodulesService } from './services/submodules.service';
import { SubmoduleDetailsPanelComponent } from './submodule-details-panel/submodule-details-panel.component';
import { CommitterCardComponent } from './committer-card/committer-card.component';
import { FileCountsComponent } from './file-counts/file-counts.component';
import { CommitFileListComponent } from './commit-file-list/commit-file-list.component';
import { FileListFilter } from './commit-file-list/file-list-filter';
import { HistoryService } from './services/history.service';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    SimpleNotificationsModule,
    HotkeyModule,
    InfrastructureModule,
    ContextMenuModule,
    JiraModule,
  ],
  entryComponents: [
    EnterLoginPromptComponent,
    SshPasswordPromptComponent,
    ForcePushPromptComponent,
    CreateBranchPromptComponent,
    TagPromptComponent,
  ],
  declarations: [BranchViewerComponent, GitViewComponent, SubwayComponent, SubwayStationsComponent, SubwayMapVisualComponent, NodeVisualComponent, LinkVisualComponent, SubwayStationAnnotComponent, ActionToolbarComponent, OpenRepoPanelComponent, StatusBarComponent, PromptComponent, EnterLoginPromptComponent, PromptContainerDirective, BranchListComponent, BranchItemComponent, SshPasswordPromptComponent, CommitDetailComponent, CommitDetailInfoComponent, CommitDetailCiComponent, CiConsoleOutputComponent, ForcePushPromptComponent, CreateBranchPromptComponent, FileViewPanelComponent, ExternalFileViewerComponent, TagPromptComponent, MapSeparatorComponent, SubmoduleDetailsPanelComponent, CommitterCardComponent, FileCountsComponent, CommitFileListComponent, FileListFilter],
  exports: [RouterModule],
  providers: [D3Service, RepoService, LayoutService, CredentialsService, CiIntegrationService, CommitSelectionService, AppveyorCiService, CommitChangeService, SubmodulesService, HistoryService],
})
export class CoreModule { }
