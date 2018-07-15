import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalFileViewerComponent } from './external-file-viewer.component';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { RouterTestingModule } from '../../../../node_modules/@angular/router/testing';
import { CommitSelectionService } from '../services/commit-selection.service';
import { MockCommitSelection } from '../mocks/mock-commit-selection-service';
import { LoadingService } from '../../infrastructure/loading-service.service';
import { MockLoading } from '../../infrastructure/mocks/mock-loading-service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { of } from 'rxjs/observable/of';


describe('ExternalFileViewerComponent', () => {
  let component: ExternalFileViewerComponent;
  let fixture: ComponentFixture<ExternalFileViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalFileViewerComponent],
      imports: [
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "test" })
          }
        },
        { provide: CommitSelectionService, useClass: MockCommitSelection },
        { provide: LoadingService, useClass: MockLoading }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalFileViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
