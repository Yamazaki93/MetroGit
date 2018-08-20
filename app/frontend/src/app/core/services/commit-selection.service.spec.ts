import { TestBed, inject } from '@angular/core/testing';

import { CommitSelectionService } from './commit-selection.service';
import { MockPromptInjector } from '../../infrastructure/mocks/mock-prompt-injector-service';
import { CredentialsService } from './credentials.service';
import { MockCredential } from '../mocks/mock-credential-service';
import { SimpleNotificationsModule } from '../../../../node_modules/angular2-notifications';
import { ElectronService } from '../../infrastructure/electron.service';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';

describe('CommitSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot()
      ],
      providers: [
        CommitSelectionService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: PromptInjectorService, useClass: MockPromptInjector},
        {provide: CredentialsService, useClass: MockCredential}
      ]
    });
  });

  it('should be created', inject([CommitSelectionService], (service: CommitSelectionService) => {
    expect(service).toBeTruthy();
  }));

  it('should set selectedCommit to null and emit changes on repo closed', inject([CommitSelectionService], (service: CommitSelectionService) => {
    let emit = false;
    let electron = TestBed.get(ElectronService) as MockElectron;
    service.selectionChange.subscribe(s => {
      emit = true;
    });
    electron.receiveEvent('Repo-Closed', {});

    expect(service.selectedCommit).toBeNull();
    expect(emit).toBeTruthy();
  }));
  it('should set selectedCommit to null and emit changes on repo opened', inject([CommitSelectionService], (service: CommitSelectionService) => {
    let emit = false;
    let electron = TestBed.get(ElectronService) as MockElectron;
    service.selectionChange.subscribe(s => {
      emit = true;
    });
    electron.receiveEvent('Repo-OpenSuccessful', {});

    expect(service.selectedCommit).toBeNull();
    expect(emit).toBeTruthy();
  }));
});
