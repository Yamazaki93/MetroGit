import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewPanelComponent } from './file-view-panel.component';

describe('FileViewPanelComponent', () => {
  let component: FileViewPanelComponent;
  let fixture: ComponentFixture<FileViewPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileViewPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
