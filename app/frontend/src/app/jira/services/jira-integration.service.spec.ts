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
  it('should emit previousStateChanged false when there\'s no previous issue', inject([JiraIntegrationService], (service: JiraIntegrationService) => {
    let emit = true;
    service.previousIssueStateChanged.subscribe(state => {
      emit = state;
    });
    service.pushPrevious('TEST');
    service.gotoPrevious();
    expect(emit).toBeFalsy();
  }));
  it('should not emit previousStateChanged false when there\'s still previous issues left', inject([JiraIntegrationService], (service: JiraIntegrationService) => {
    let emit = true;
    service.previousIssueStateChanged.subscribe(state => {
      emit = state;
    });
    service.pushPrevious('TEST');
    service.pushPrevious('TEST2');
    service.gotoPrevious();
    expect(emit).toBeTruthy();
  }));
  it('should not call navigateTo when there\'s no previous issue on gotoPrevious', inject([JiraIntegrationService], (service: JiraIntegrationService) => {
    let spy = spyOn(service, 'navigateToIssue').and.callThrough();
    service.gotoPrevious();
    expect(spy).not.toHaveBeenCalled();
  }));
  it('should not push dupicated issue to previousStack', inject([JiraIntegrationService], (service: JiraIntegrationService) => {
    service.pushPrevious('Test');
    service.pushPrevious('Test');
    expect(service.previousIssueStack.length).toBe(1);
  }));
});
