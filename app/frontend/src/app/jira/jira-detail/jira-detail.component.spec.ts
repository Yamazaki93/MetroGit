import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraDetailComponent } from './jira-detail.component';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { MockJira } from '../../core/mocks/mock-jira-service';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { MockPromptInjector } from '../../infrastructure/mocks/mock-prompt-injector-service';
import { LayoutService } from '../../core/services/layout.service';
import { MockLayout } from '../../core/mocks/mock-layout-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('JiraDetailComponent', () => {
  let component: JiraDetailComponent;
  let fixture: ComponentFixture<JiraDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JiraDetailComponent],
      providers: [
        { provide: ElectronService, useClass: MockElectron },
        { provide: JiraIntegrationService, useClass: MockJira },
        { provide: PromptInjectorService, useClass: MockPromptInjector },
        { provide: LayoutService, useClass: MockLayout }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call jiraService.pushPrevious when loading different issue', () => {
    let jiraSvc = TestBed.get(JiraIntegrationService) as MockJira;
    let previousSpy = spyOn(jiraSvc, 'pushPrevious').and.callThrough();
    component.loadIssue('TEST');

    expect(previousSpy).toHaveBeenCalled();
  });

  it('should not call jiraService.pushPrevious when loading same issue', () => {
    let jiraSvc = TestBed.get(JiraIntegrationService) as MockJira;
    component.loadIssue('TEST');
    let previousSpy = spyOn(jiraSvc, 'pushPrevious').and.callThrough();
    component.loadIssue('TEST');

    expect(previousSpy).toHaveBeenCalledTimes(0);
  });
  it('should subscribe to previous/nextIssue changed', () => {
    let jiraSvc = TestBed.get(JiraIntegrationService) as MockJira;
    jiraSvc.previousIssueStateChanged.emit(true);
    jiraSvc.nextIssueStateChanged.emit(true);

    expect(component.canPrevious).toBeTruthy();
    expect(component.canNext).toBeTruthy();
  });
});
