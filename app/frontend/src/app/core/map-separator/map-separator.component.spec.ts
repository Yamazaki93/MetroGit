import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSeparatorComponent } from './map-separator.component';

describe('MapSeparatorComponent', () => {
  let component: MapSeparatorComponent;
  let fixture: ComponentFixture<MapSeparatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSeparatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
