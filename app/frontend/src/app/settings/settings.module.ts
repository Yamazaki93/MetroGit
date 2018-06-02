import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { SettingsNavComponent } from './settings-nav/settings-nav.component';
import { RouterModule, Routes } from '@angular/router';
import { CiSettingsComponent } from './ci-settings/ci-settings.component';
import { SettingsService } from './services/settings.service';
import { AuthSettingsComponent } from './auth-settings/auth-settings.component';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { FormsModule } from '@angular/forms';
import { JiraSettingsComponent } from './jira-settings/jira-settings.component';
import { TagInputModule } from 'ngx-chips';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { RepoProfileComponent } from './repo-profile/repo-profile.component';
import { UpdaterComponent } from './updater/updater.component';

const appRoutes: Routes = [
  {
    path: 'settings', component: SettingsPageComponent,
    children: [
      {
        path: 'ci', component: CiSettingsComponent
      },
      {
        path: 'auth', component: AuthSettingsComponent
      },
      {
        path: 'general', component: GeneralSettingsComponent
      },
      {
        path: 'jira', component: JiraSettingsComponent
      },
      {
        path: 'profile', component: ProfileSettingsComponent
      },
      {
        path: 'repo-profile', component: RepoProfileComponent
      },
      {
        path: 'updater', component: UpdaterComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    NgbModule,
    RouterModule.forChild(appRoutes),
    FormsModule,
    InfrastructureModule,
  ],
  exports: [
    RouterModule, CiSettingsComponent
  ],
  declarations: [SettingsPageComponent, SettingsNavComponent, CiSettingsComponent, AuthSettingsComponent, GeneralSettingsComponent, JiraSettingsComponent, ProfileSettingsComponent, RepoProfileComponent, UpdaterComponent],
  providers: [SettingsService],
})
export class SettingsModule { }
