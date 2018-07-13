import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitViewComponent } from './git-view.component';
import { BranchViewerComponent } from '../branch-viewer/branch-viewer.component';
import { SubwayComponent } from '../subway/subway.component';
import { SubwayStationsComponent } from '../subway-stations/subway-stations.component';
import { RepoService } from '../services/repo.service';
import { MockRepo } from '../mocks/mock-repo-service';
import { LoadingService } from '../../infrastructure/loading-service.service';
import { MockLoading } from '../../infrastructure/mocks/mock-loading-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { ContextMenuModule } from '../../../../node_modules/ngx-contextmenu';
import { RouterTestingModule } from '../../../../node_modules/@angular/router/testing';
import { LayoutService } from '../services/layout.service';
import { MockLayout } from '../mocks/mock-layout-service';
import { D3Service } from '../d3/d3.service';
import { MockD3 } from '../mocks/mock-d3-service';
import { SubmodulesService } from '../services/submodules.service';
import { MockSubmodule } from '../mocks/mock-submodule-service';
import { UpdaterService } from '../../infrastructure/updater.service';
import { MockUpdater } from '../../infrastructure/mocks/mock-updater-service';

describe('GitViewComponent', () => {
  let component: GitViewComponent;
  let fixture: ComponentFixture<GitViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GitViewComponent, BranchViewerComponent, SubwayComponent, SubwayStationsComponent],
      imports: [
        ContextMenuModule,
        RouterTestingModule
      ],
      providers: [
        { provide: RepoService, useClass: MockRepo },
        { provide: LoadingService, useClass: MockLoading },
        { provide: LayoutService, useClass: MockLayout },
        { provide: D3Service, useClass: MockD3 },
        { provide: SubmodulesService, useClass: MockSubmodule },
        { provide: UpdaterService, useClass: MockUpdater}
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
