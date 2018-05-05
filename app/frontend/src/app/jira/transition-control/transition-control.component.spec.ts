import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionControlComponent } from './transition-control.component';

describe('TransitionControlComponent', () => {
  let component: TransitionControlComponent;
  let fixture: ComponentFixture<TransitionControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
