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


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    InfrastructureModule
  ],
  providers: [
    JiraIntegrationService
  ],
  entryComponents: [
    AddCommentPromptComponent,
    SubtaskPromptComponent
  ],
  exports: [ JiraDetailComponent ],
  declarations: [JiraDetailComponent, JiraRichTextComponent, TransitionControlComponent, AddCommentPromptComponent, ProfileSelectorComponent, ProfileFilterPipe, SubtaskPromptComponent, TitleEditorComponent]
})
export class JiraModule { }
