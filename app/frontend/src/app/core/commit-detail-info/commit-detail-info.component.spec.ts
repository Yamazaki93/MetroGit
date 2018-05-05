import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitDetailInfoComponent } from './commit-detail-info.component';

describe('CommitDetailInfoComponent', () => {
  let component: CommitDetailInfoComponent;
  let fixture: ComponentFixture<CommitDetailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitDetailInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
