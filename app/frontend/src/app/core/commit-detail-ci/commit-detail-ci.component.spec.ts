import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitDetailCiComponent } from './commit-detail-ci.component';

describe('CommitDetailCiComponent', () => {
  let component: CommitDetailCiComponent;
  let fixture: ComponentFixture<CommitDetailCiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitDetailCiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitDetailCiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
