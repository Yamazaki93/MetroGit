import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitViewComponent } from './git-view.component';
import { BranchViewerComponent } from '../branch-viewer/branch-viewer.component';
import { SubwayComponent } from '../subway/subway.component';
import { SubwayStationsComponent } from '../subway-stations/subway-stations.component';

describe('GitViewComponent', () => {
  let component: GitViewComponent;
  let fixture: ComponentFixture<GitViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitViewComponent, BranchViewerComponent, SubwayComponent, SubwayStationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
