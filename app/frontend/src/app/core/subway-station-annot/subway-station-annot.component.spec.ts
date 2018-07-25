import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayStationAnnotComponent } from './subway-station-annot.component';
import { RepoService } from '../services/repo.service';
import { MockRepo } from '../mocks/mock-repo-service';
import { MockCommitSelection } from '../mocks/mock-commit-selection-service';
import { D3Service } from '../d3/d3.service';
import { ContextMenuService, ContextMenuModule } from '../../../../node_modules/ngx-contextmenu';
import { MockContextMenuService } from '../mocks/mock-context-menu-service';
import { CommitSelectionService } from '../services/commit-selection.service';
import { MockD3 } from '../mocks/mock-d3-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('SubwayStationAnnotComponent', () => {
  let component: SubwayStationAnnotComponent;
  let fixture: ComponentFixture<SubwayStationAnnotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ContextMenuModule
      ],
      declarations: [SubwayStationAnnotComponent],
      providers: [
        { provide: RepoService, useClass: MockRepo },
        { provide: CommitSelectionService, useClass: MockCommitSelection },
        { provide: D3Service, useClass: MockD3 },
        { provide: ContextMenuService, useClass: MockContextMenuService },

      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayStationAnnotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should not error out if repo exist without current branch and commits (right after init)', () => {
    let RepoSvc = TestBed.get(RepoService) as MockRepo;
    RepoSvc.hasRepository = true;
    RepoSvc.currentBranch = undefined;
    spyOn(RepoSvc, 'getCommitsWithWIP').and.returnValue([]);

    let fixtureLocal = TestBed.createComponent(SubwayStationAnnotComponent);
    let compLocal = fixtureLocal.componentInstance;
    fixtureLocal.detectChanges();

    expect(compLocal).toBeTruthy();
  });
});
