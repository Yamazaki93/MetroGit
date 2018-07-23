import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchViewerComponent } from './branch-viewer.component';
import { ActionToolbarComponent } from '../action-toolbar/action-toolbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BranchListComponent } from '../branch-list/branch-list.component';
import { OpenRepoPanelComponent } from '../open-repo-panel/open-repo-panel.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RepoService } from '../services/repo.service';
import { MockRepo } from '../mocks/mock-repo-service';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutService } from '../services/layout.service';
import { MockLayout } from '../mocks/mock-layout-service';
import { D3Service } from '../d3/d3.service';
import { MockD3 } from '../mocks/mock-d3-service';
import { MockSubmodule } from '../mocks/mock-submodule-service';
import { SubmodulesService } from '../services/submodules.service';
import { UpdaterService } from '../../infrastructure/updater.service';
import { MockUpdater } from '../../infrastructure/mocks/mock-updater-service';

describe('BranchViewerComponent', () => {
  let component: BranchViewerComponent;
  let fixture: ComponentFixture<BranchViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchViewerComponent ],
      imports: [
        NgbModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {provide: RepoService, useClass: MockRepo},
        {provide: LayoutService, useClass: MockLayout},
        {provide: SubmodulesService, useClass: MockSubmodule},
        {provide: D3Service, useClass: MockD3},
        {provide: UpdaterService, useClass: MockUpdater}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have toggled class only if toggeled is true', () => {
    component.toggled = true;
    fixture.detectChanges();
    let nav_cont = fixture.nativeElement.querySelector('#side-nav');
    expect(nav_cont.getAttribute('class')).toMatch('toggled');
    component.toggled = false;
    fixture.detectChanges();
    expect(nav_cont.getAttribute('class')).not.toContain('toggled');
  });

  it('should show correct toggle button', () => {
    component.toggled = true;
    fixture.detectChanges();
    let nav_cont = fixture.nativeElement.querySelector('#toggle-button span');
    expect(nav_cont.getAttribute('class')).toMatch('icon-chevron-left');
    component.toggled = false;
    fixture.detectChanges();
    expect(nav_cont.getAttribute('class')).toMatch('icon-chevron-right');
  });
  it('should toggle navigation when toggleNavigation is called', () => {
    component.toggled = true;
    component.toggleNavigation();
    expect(component.toggled).toBeFalsy();
  });
  it('should set empty branch and branchTarget if repo exist without current branch (right after init)', () => {
    let RepoSvc = TestBed.get(RepoService) as MockRepo;
    RepoSvc.hasRepository = true;
    RepoSvc.currentBranch = undefined;

    let fixtureLocal = TestBed.createComponent(BranchViewerComponent);
    let compLocal = fixtureLocal.componentInstance;
    fixtureLocal.detectChanges();

    expect(compLocal).toBeTruthy();
    expect(compLocal.branchName).toBe('');
    expect(compLocal.branchTarget).toBe('');
  });
});
