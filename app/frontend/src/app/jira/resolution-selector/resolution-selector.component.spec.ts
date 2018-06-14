import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionSelectorComponent } from './resolution-selector.component';

describe('ResolutionSelectorComponent', () => {
  let component: ResolutionSelectorComponent;
  let fixture: ComponentFixture<ResolutionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
