import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCountsComponent } from './file-counts.component';

describe('FileCountsComponent', () => {
  let component: FileCountsComponent;
  let fixture: ComponentFixture<FileCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileCountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
