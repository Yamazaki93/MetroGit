import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayStationsComponent } from './subway-stations.component';
import { D3Service } from '../d3/d3.service';
import { RepoService } from '../services/repo.service';
import { CommitChangeService } from '../services/commit-change.service';
import { CommitSelectionService } from '../services/commit-selection.service';
import { ContextMenuService, ContextMenuModule, ContextMenuComponent } from '../../../../node_modules/ngx-contextmenu';
import { MockD3 } from '../mocks/mock-d3-service';
import { MockCommitSelection } from '../mocks/mock-commit-selection-service';
import { MockRepo } from '../mocks/mock-repo-service';
import { MockCommitChange } from '../mocks/mock-commit-change-service';
import { MockContextMenuService } from '../mocks/mock-context-menu-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('SubwayStationsComponent', () => {
  let component: SubwayStationsComponent;
  let fixture: ComponentFixture<SubwayStationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ContextMenuModule
      ],
      declarations: [SubwayStationsComponent],
      providers: [
        { provide: D3Service, useClass: MockD3 },
        { provide: CommitSelectionService, useClass: MockCommitSelection },
        { provide: RepoService, useClass: MockRepo },
        { provide: CommitChangeService, useClass: MockCommitChange },
        { provide: ContextMenuService, useClass: MockContextMenuService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
