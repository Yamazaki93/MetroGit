import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionToolbarComponent } from './action-toolbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { CoreModule } from '../core.module';
import { RepoService } from '../services/repo.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications';
import { CredentialsService } from '../services/credentials.service';
import { CommitChangeService } from '../services/commit-change.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CommitSelectionService } from '../services/commit-selection.service';
import { HotkeysService } from 'angular2-hotkeys';
import { MockHotkeys } from '../mocks/mock-hotkeys-service';
import { LayoutService } from '../services/layout.service';
import { MockLayout } from '../mocks/mock-layout-service';
import { MockCommitSelection } from '../mocks/mock-commit-selection-service';
import { MockCommitChange } from '../mocks/mock-commit-change-service';
import { MockRepo } from '../mocks/mock-repo-service';

describe('ActionToolbarComponent', () => {
  let component: ActionToolbarComponent;
  let fixture: ComponentFixture<ActionToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot(),
        NgbModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        InfrastructureModule,
      ],
      providers: [
        { provide: ElectronService, useClass: MockElectron },
        { provide: RepoService, useClass: MockRepo },
        { provide: HotkeysService, useClass: MockHotkeys },
        { provide: CommitChangeService, useClass: MockCommitChange },
        { provide: LayoutService, useClass: MockLayout }
      ],
      declarations: [ActionToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should indicate pulling status on pulling emit', () => {
    let repo = TestBed.get(RepoService) as RepoService;

    repo.pulling.emit(true);
    fixture.detectChanges();

    expect(component.pulling).toBeTruthy();
  });
  it('should indicate pushing status on pushing emit', () => {
    let repo = TestBed.get(RepoService) as RepoService;

    repo.pushing.emit(true);
    fixture.detectChanges();

    expect(component.pushing).toBeTruthy();
  });
  it('should indicate stashing status on stash', () => {
    component.stash();
    fixture.detectChanges();

    expect(component.stashing).toBeTruthy();
  });
  it('should not indicating stashing after stashed', () => {
    let cc = TestBed.get(CommitChangeService) as CommitChangeService;

    component.stash();
    cc.stashed.emit();
    fixture.detectChanges();

    expect(component.stashing).toBeFalsy();
  });
  it('should indicate popping status on pop', () => {
    component.pop();
    fixture.detectChanges();

    expect(component.popping).toBeTruthy();
  });
  it('should not indicating popping after popped', () => {
    let cc = TestBed.get(CommitChangeService) as CommitChangeService;

    component.pop();
    cc.popped.emit();
    fixture.detectChanges();

    expect(component.popping).toBeFalsy();
  });
});

