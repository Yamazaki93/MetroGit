import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JiraIntegrationService } from './services/jira-integration.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { JiraDetailComponent } from './jira-detail/jira-detail.component';
import { JiraRichTextComponent } from './jira-rich-text/jira-rich-text.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransitionControlComponent } from './transition-control/transition-control.component';
import { AddCommentPromptComponent } from './add-comment-prompt/add-comment-prompt.component';
import { FormsModule } from '@angular/forms';
import { ProfileSelectorComponent } from './profile-selector/profile-selector.component';
import { ProfileFilterPipe } from './profile-selector/profile-filter';
import { SubtaskPromptComponent } from './subtask-prompt/subtask-prompt.component';
import { TitleEditorComponent } from './title-editor/title-editor.component';
import { KeySelectorComponent } from './key-selector/key-selector.component';
import { ResolutionSelectorComponent } from './resolution-selector/resolution-selector.component';
import { JIRAIssueGuard } from './services/jira-issue-link-guard';
import { RouterModule } from '@angular/router';
import { ResolutionControlComponent } from './resolution-control/resolution-control.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    InfrastructureModule
  ],
  providers: [
    JiraIntegrationService,
    JIRAIssueGuard
  ],
  entryComponents: [
    AddCommentPromptComponent,
    SubtaskPromptComponent,
    ResolutionSelectorComponent
  ],
  exports: [ JiraDetailComponent ],
  declarations: [JiraDetailComponent, JiraRichTextComponent, TransitionControlComponent, AddCommentPromptComponent, ProfileSelectorComponent, ProfileFilterPipe, KeySelectorComponent, SubtaskPromptComponent, TitleEditorComponent, ResolutionSelectorComponent, ResolutionControlComponent]
})
export class JiraModule { }
