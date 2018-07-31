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

  it('should register issue as previous when call pushPrevious', inject([JiraIntegrationService], (service: JiraIntegrationService) => {
    service.pushPrevious('TEST');
    service.pushPrevious('TEST2');

    expect(service.previousIssueStack[0]).toBe('TEST');
    expect(service.previousIssueStack[1]).toBe('TEST2');
  }));
  it('should emit previousStateChanged true once when there\'s previous issue added', inject([JiraIntegrationService], (service: JiraIntegrationService) => {
    let emit = false;
    service.previousIssueStateChanged.subscribe(state => {
      emit = state;
    });
    service.pushPrevious('TEST');

    expect(emit).toBeTruthy();

    emit = false;
    service.pushPrevious('TEST');

    expect(emit).toBeFalsy();
  }));
});
