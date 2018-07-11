import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitDetailInfoComponent } from './commit-detail-info.component';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { D3Service } from '../d3/d3.service';
import { MockD3 } from '../mocks/mock-d3-service';
import { CommitSelectionService } from '../services/commit-selection.service';
import { MockCommitSelection } from '../mocks/mock-commit-selection-service';
import { CommitChangeService } from '../services/commit-change.service';
import { MockCommitChange } from '../mocks/mock-commit-change-service';
import { LayoutService } from '../services/layout.service';
import { MockLayout } from '../mocks/mock-layout-service';

describe('CommitDetailInfoComponent', () => {
  let component: CommitDetailInfoComponent;
  let fixture: ComponentFixture<CommitDetailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitDetailInfoComponent ],
      providers: [
        {provide: D3Service, useClass: MockD3},
        {provide: CommitSelectionService, useClass: MockCommitSelection},
        {provide: CommitChangeService, useClass: MockCommitChange},
        {provide: LayoutService, useClass: MockLayout},
      ],
      schemas: [NO_ERRORS_SCHEMA],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
