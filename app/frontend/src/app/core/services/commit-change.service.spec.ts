import { TestBed, inject } from '@angular/core/testing';

import { CommitChangeService } from './commit-change.service';
import { MockCommitSelection } from '../mocks/mock-commit-selection-service';
import { HotkeysService } from '../../../../node_modules/angular2-hotkeys';
import { MockHotkeys } from '../mocks/mock-hotkeys-service';
import { LoadingService } from '../../infrastructure/loading-service.service';
import { MockLoading } from '../../infrastructure/mocks/mock-loading-service';
import { CommitSelectionService } from './commit-selection.service';
import { CredentialsService } from './credentials.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { MockCredential } from '../mocks/mock-credential-service';
import { SimpleNotificationsModule } from '../../../../node_modules/angular2-notifications';
import { RouterTestingModule } from '../../../../node_modules/@angular/router/testing';

describe('CommitChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        CommitChangeService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: CredentialsService, useClass: MockCredential},
        {provide: CommitSelectionService, useClass: MockCommitSelection},
        {provide: HotkeysService, useClass: MockHotkeys},
        {provide: LoadingService, useClass: MockLoading}
      ]
    });
  });

  it('should be created', inject([CommitChangeService], (service: CommitChangeService) => {
    expect(service).toBeTruthy();
  }));

  it('should emit popped when Repo-Popped', inject([CommitChangeService], (service: CommitChangeService)  => {
    let electron = TestBed.get(ElectronService) as MockElectron;
    let emit = false;
    service.popped.subscribe(() => {
      emit = true;
    });

    electron.receiveEvent('Repo-Popped', {});

    expect(emit).toBeTruthy();
  }));
});
