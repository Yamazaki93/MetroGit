import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitDetailCiComponent } from './commit-detail-ci.component';
import { NgbModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { CiIntegrationService } from '../services/ci-integration.service';
import { MockCIIntegration } from '../mocks/mock-ci-integration-service';
import { LayoutService } from '../services/layout.service';
import { MockLayout } from '../mocks/mock-layout-service';
import { AppveyorCiService } from '../services/appveyor-ci.service';
import { MockAppVeyor } from '../mocks/mock-appveyor-ci-service';

describe('CommitDetailCiComponent', () => {
  let component: CommitDetailCiComponent;
  let fixture: ComponentFixture<CommitDetailCiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitDetailCiComponent ],
      imports: [
        NgbModule.forRoot(),
      ],
      providers: [
        {provide: CiIntegrationService, useClass: MockCIIntegration},
        {provide: LayoutService, useClass: MockLayout},
        {provide: AppveyorCiService, useClass: MockAppVeyor},

      ],
      schemas: [NO_ERRORS_SCHEMA],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitDetailCiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
