import { TestBed, inject } from '@angular/core/testing';

import { CredentialsService } from './credentials.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { MockPromptInjector } from '../../infrastructure/mocks/mock-prompt-injector-service';
import { SimpleNotificationsModule } from '../../../../node_modules/angular2-notifications';
import { RouterTestingModule } from '../../../../node_modules/@angular/router/testing';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';

describe('CredentialsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        CredentialsService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: PromptInjectorService, useClass: MockPromptInjector},
      ]
    });
  });

  it('should be created', inject([CredentialsService], (service: CredentialsService) => {
    expect(service).toBeTruthy();
  }));
});
