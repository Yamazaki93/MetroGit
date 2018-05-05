import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionToolbarComponent } from './action-toolbar.component';

describe('ActionToolbarComponent', () => {
  let component: ActionToolbarComponent;
  let fixture: ComponentFixture<ActionToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionToolbarComponent ]
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
});
