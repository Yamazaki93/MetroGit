import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRepoPanelComponent } from './open-repo-panel.component';
import { NgbModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { RepoService } from '../services/repo.service';
import { MockRepo } from '../mocks/mock-repo-service';
import { LayoutService } from '../services/layout.service';
import { MockLayout } from '../mocks/mock-layout-service';
import { HistoryService } from '../services/history.service';
import { MockHistory } from '../mocks/mock-history-service';

describe('OpenRepoPanelComponent', () => {
  let component: OpenRepoPanelComponent;
  let fixture: ComponentFixture<OpenRepoPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenRepoPanelComponent ],
      imports: [
        NgbModule
      ],
      providers: [
        {provide: RepoService, useClass: MockRepo},
        {provide: LayoutService, useClass: MockLayout},
        {provide: HistoryService, useClass: MockHistory}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenRepoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate initialize new repo to browseInitFolder', () => {
    let repoSvc = TestBed.get(RepoService);
    let openRepoSpy = spyOn(repoSvc, 'browseInitFolder').and.callThrough();

    fixture.nativeElement.querySelector('#open-repo-panel-init-btn').click();

    expect(openRepoSpy).toHaveBeenCalled();
  });
});
