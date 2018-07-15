import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayComponent } from './subway.component';
import { SubwayStationsComponent } from '../subway-stations/subway-stations.component';
import { RepoService } from '../services/repo.service';
import { MockRepo } from '../mocks/mock-repo-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { ContextMenuService, ContextMenuModule } from '../../../../node_modules/ngx-contextmenu';
import { MockContextMenuService } from '../mocks/mock-context-menu-service';

describe('SubwayComponent', () => {
  let component: SubwayComponent;
  let fixture: ComponentFixture<SubwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ContextMenuModule
      ],
      declarations: [ SubwayComponent, SubwayStationsComponent ],
      providers: [
        {provide: RepoService, useClass: MockRepo},
        {provide: ContextMenuService, useClass: MockContextMenuService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
