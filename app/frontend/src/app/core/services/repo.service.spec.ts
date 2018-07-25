import { TestBed, inject } from '@angular/core/testing';

import { RepoService } from './repo.service';
import { MockLoading } from '../../infrastructure/mocks/mock-loading-service';
import { StatusBarService } from '../../infrastructure/status-bar.service';
import { MockStatusBar } from '../../infrastructure/mocks/mock-status-bar-service';
import { CommitChangeService } from './commit-change.service';
import { MockHotkeys } from '../mocks/mock-hotkeys-service';
import { HotkeysService } from '../../../../node_modules/angular2-hotkeys';
import { MockCommitChange } from '../mocks/mock-commit-change-service';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { MockPromptInjector } from '../../infrastructure/mocks/mock-prompt-injector-service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { ElectronService } from '../../infrastructure/electron.service';
import { LoadingService } from '../../infrastructure/loading-service.service';
import { SimpleNotificationsComponent, SimpleNotificationsModule, NotificationsService } from '../../../../node_modules/angular2-notifications';
import { RouterTestingModule } from '../../../../node_modules/@angular/router/testing';
import { MockCredential } from '../mocks/mock-credential-service';
import { CredentialsService } from './credentials.service';

describe('RepoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RepoService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: LoadingService, useClass: MockLoading},
        {provide: StatusBarService, useClass: MockStatusBar},
        {provide: PromptInjectorService, useClass: MockPromptInjector},
        {provide: CommitChangeService, useClass: MockCommitChange},
        {provide: CredentialsService, useClass: MockCredential},
        {provide: HotkeysService, useClass: MockHotkeys},
      ],
      imports: [
        RouterTestingModule,
        SimpleNotificationsModule.forRoot()
      ]
    });
  });

  it('should be created', inject([RepoService], (service: RepoService) => {
    expect(service).toBeTruthy();
  }));

  it('should send Repo-InitBrowse on browseInitFolder', inject([RepoService], (service: RepoService) => {
    let electronSvc = TestBed.get(ElectronService) as MockElectron;

    service.browseInitFolder();

    expect(electronSvc.messageWasSent('Repo-InitBrowse')).toBeTruthy();
  }));

  it('should send Repo-Init on Repo-InitPathSelected', inject([RepoService], (service: RepoService) => {
    let electronSvc = TestBed.get(ElectronService) as MockElectron;
    service.init();

    electronSvc.receiveEvent('Repo-InitPathSelected', {path: 'TestPath'});

    expect(electronSvc.messageWasSent('Repo-Init')).toBeTruthy();
  }));
  it('should openRepo on Repo-InitSuccessful', inject([RepoService], (service: RepoService) => {
    let electronSvc = TestBed.get(ElectronService) as MockElectron;
    service.init();

    electronSvc.receiveEvent('Repo-InitSuccessful', {path: 'TestPath'});

    expect(electronSvc.messageWasSent('Repo-Open')).toBeTruthy();
  }));
  it('should show error notification on Repo-InitFailed', inject([RepoService], (service: RepoService) => {
    let noti = TestBed.get(NotificationsService) as NotificationsService;
    let electronSvc = TestBed.get(ElectronService) as MockElectron;
    let notiSpy = spyOn(noti, 'error').and.callThrough();
    service.init();

    electronSvc.receiveEvent('Repo-InitFailed', {});

    expect(notiSpy).toHaveBeenCalled();
  }));
});
