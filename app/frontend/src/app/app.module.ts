import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { GitViewComponent } from './core/git-view/git-view.component';
import { APP_BASE_HREF } from '@angular/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { SettingsModule } from './settings/settings.module';
import { SettingsPageComponent } from './settings/settings-page/settings-page.component';
import { CiSettingsComponent } from './settings/ci-settings/ci-settings.component';
import { AuthSettingsComponent } from './settings/auth-settings/auth-settings.component';
import { GeneralSettingsComponent } from './settings/general-settings/general-settings.component';
import { JiraSettingsComponent } from './settings/jira-settings/jira-settings.component';
import { TagInputModule } from 'ngx-chips';
import { ContextMenuModule } from 'ngx-contextmenu';

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
      }
    ]
  },
  { path: 'git', component: GitViewComponent },
  { path: '', redirectTo: 'git', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TagInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    ContextMenuModule.forRoot(),
    SimpleNotificationsModule.forRoot({
      position: [
        'top',
        'right'
      ],
      timeOut: 10000,
      // showProgressBar: false,
      icons: {
        success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.7 5.3c-0.4-0.4-1-0.4-1.4 0l-10.3 10.3-4.3-4.3c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l5 5c0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3l11-11c0.4-0.4 0.4-1 0-1.4z"></path></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.4 12l5.3-5.3c0.4-0.4 0.4-1 0-1.4s-1-0.4-1.4 0l-5.3 5.3-5.3-5.3c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l5.3 5.3-5.3 5.3c-0.4 0.4-0.4 1 0 1.4 0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3l5.3-5.3 5.3 5.3c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.4-0.4 0.4-1 0-1.4l-5.3-5.3z"></path></svg>',
        alert: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 1c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11zM12 21c-5 0-9-4-9-9s4-9 9-9c5 0 9 4 9 9s-4 9-9 9z"></path><path d="M12 7c-0.6 0-1 0.4-1 1v4c0 0.6 0.4 1 1 1s1-0.4 1-1v-4c0-0.6-0.4-1-1-1z"></path><path d="M11.3 15.3c-0.2 0.2-0.3 0.4-0.3 0.7s0.1 0.5 0.3 0.7c0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.2-0.2 0.3-0.5 0.3-0.7s-0.1-0.5-0.3-0.7c-0.4-0.4-1-0.4-1.4 0z"></path></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 1c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11zM12 21c-5 0-9-4-9-9s4-9 9-9c5 0 9 4 9 9s-4 9-9 9z"></path><path d="M12 11c-0.6 0-1 0.4-1 1v4c0 0.6 0.4 1 1 1s1-0.4 1-1v-4c0-0.6-0.4-1-1-1z"></path><path d="M11.3 7.3c-0.2 0.2-0.3 0.4-0.3 0.7s0.1 0.5 0.3 0.7c0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.2-0.2 0.3-0.4 0.3-0.7s-0.1-0.5-0.3-0.7c-0.4-0.4-1-0.4-1.4 0z"></path></svg>',
        warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 17.5l-8.4-14.2c-0.4-0.7-1.1-1.2-1.9-1.4s-1.6-0.1-2.3 0.3c-0.4 0.2-0.8 0.6-1 1 0 0 0 0 0 0l-8.4 14.3c-0.8 1.4-0.3 3.3 1.1 4.1 0.4 0.3 0.9 0.4 1.4 0.4h17c0.8 0 1.6-0.3 2.1-0.9 0.6-0.6 0.9-1.3 0.9-2.1-0.1-0.5-0.2-1.1-0.5-1.5zM21.2 19.7c-0.2 0.2-0.5 0.3-0.7 0.3h-17c-0.2 0-0.3 0-0.5-0.1-0.5-0.3-0.6-0.9-0.4-1.4l8.5-14.1c0.1-0.1 0.2-0.3 0.3-0.3 0.5-0.3 1.1-0.1 1.4 0.3l8.5 14.1c0.1 0.1 0.1 0.3 0.1 0.5 0.1 0.3-0.1 0.5-0.2 0.7z"></path><path d="M12 8c-0.6 0-1 0.4-1 1v4c0 0.6 0.4 1 1 1s1-0.4 1-1v-4c0-0.6-0.4-1-1-1z"></path><path d="M11.3 16.3c-0.2 0.2-0.3 0.4-0.3 0.7s0.1 0.5 0.3 0.7c0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.2-0.2 0.3-0.5 0.3-0.7s-0.1-0.5-0.3-0.7c-0.4-0.4-1-0.4-1.4 0z"></path></svg>'
      },
      theClass: 'top-noti'
    }),
    InfrastructureModule,
    CoreModule,
    SettingsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true, useHash: true } // <-- debugging purposes only
    ),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
