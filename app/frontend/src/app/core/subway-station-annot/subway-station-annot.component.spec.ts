import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayStationAnnotComponent } from './subway-station-annot.component';

describe('SubwayStationAnnotComponent', () => {
  let component: SubwayStationAnnotComponent;
  let fixture: ComponentFixture<SubwayStationAnnotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubwayStationAnnotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayStationAnnotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
