import { TestBed, inject } from '@angular/core/testing';

import { JiraIntegrationService } from './jira-integration.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { StatusBarService } from '../../infrastructure/status-bar.service';
import { MockStatusBar } from '../../infrastructure/mocks/mock-status-bar-service';
import { SimpleNotificationsModule } from '../../../../node_modules/angular2-notifications';

describe('JiraIntegrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot()
      ],
      providers: [
        JiraIntegrationService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: StatusBarService, useClass: MockStatusBar},
      ]
    });
  });

  it('should be created', inject([JiraIntegrationService], (service: JiraIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
