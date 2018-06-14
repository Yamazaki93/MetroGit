import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleEditorComponent } from './title-editor.component';

describe('TitleEditorComponent', () => {
  let component: TitleEditorComponent;
  let fixture: ComponentFixture<TitleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
