import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewPanelComponent } from './file-view-panel.component';
import { CommitSelectionService } from '../services/commit-selection.service';
import { MockCommitSelection } from '../mocks/mock-commit-selection-service';
import { CommitChangeService } from '../services/commit-change.service';
import { MockCommitChange } from '../mocks/mock-commit-change-service';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('FileViewPanelComponent', () => {
  let component: FileViewPanelComponent;
  let fixture: ComponentFixture<FileViewPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileViewPanelComponent ],
      imports: [
        FormsModule
      ],
      providers: [
        {provide: CommitSelectionService, useClass: MockCommitSelection},
        {provide: CommitChangeService, useClass: MockCommitChange},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
