import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalFileViewerComponent } from './external-file-viewer.component';

describe('ExternalFileViewerComponent', () => {
  let component: ExternalFileViewerComponent;
  let fixture: ComponentFixture<ExternalFileViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalFileViewerComponent ]
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
