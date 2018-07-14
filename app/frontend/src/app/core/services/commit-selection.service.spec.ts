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
});
