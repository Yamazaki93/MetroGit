import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitDetailComponent } from './commit-detail.component';
import { NgbModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { CommitSelectionService } from '../services/commit-selection.service';
import { MockCommitSelection } from '../mocks/mock-commit-selection-service';
import { CiIntegrationService } from '../services/ci-integration.service';
import { MockCIIntegration } from '../mocks/mock-ci-integration-service';
import { JiraIntegrationService } from '../../jira/services/jira-integration.service';
import { MockJira } from '../mocks/mock-jira-service';
import { LayoutService } from '../services/layout.service';
import { MockLayout } from '../mocks/mock-layout-service';

describe('CommitDetailComponent', () => {
  let component: CommitDetailComponent;
  let fixture: ComponentFixture<CommitDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommitDetailComponent],
      providers: [
        { provide: CommitSelectionService, useClass: MockCommitSelection },
        { provide: CiIntegrationService, useClass: MockCIIntegration },
        { provide: JiraIntegrationService, useClass: MockJira },
        { provide: LayoutService, useClass: MockLayout }
      ],
      imports: [
        NgbModule.forRoot(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should untoggle panel and file panel when selected commit is null', () => {
    let commitSelection = TestBed.get(CommitSelectionService) as MockCommitSelection;
    component.toggled = true;
    component.fileToggled = true;

    commitSelection.selectionChange.emit(null);
    fixture.detectChanges();

    expect(component.toggled).toBeFalsy();
    expect(component.fileToggled).toBeFalsy();
  });
});
