import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitFileListComponent } from './commit-file-list.component';

describe('CommitFileListComponent', () => {
  let component: CommitFileListComponent;
  let fixture: ComponentFixture<CommitFileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitFileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
