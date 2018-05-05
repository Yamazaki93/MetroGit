import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayStationsComponent } from './subway-stations.component';

describe('SubwayStationsComponent', () => {
  let component: SubwayStationsComponent;
  let fixture: ComponentFixture<SubwayStationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubwayStationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
