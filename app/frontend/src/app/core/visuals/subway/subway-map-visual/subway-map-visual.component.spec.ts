import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayMapVisualComponent } from './subway-map-visual.component';

describe('SubwayMapVisualComponent', () => {
  let component: SubwayMapVisualComponent;
  let fixture: ComponentFixture<SubwayMapVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubwayMapVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayMapVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
