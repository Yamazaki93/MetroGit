import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitDetailComponent } from './commit-detail.component';
import { NgbModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('CommitDetailComponent', () => {
  let component: CommitDetailComponent;
  let fixture: ComponentFixture<CommitDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitDetailComponent ],
      imports: [
        NgbModule.forRoot(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
