import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayComponent } from './subway.component';
import { SubwayStationsComponent } from '../subway-stations/subway-stations.component';

describe('SubwayComponent', () => {
  let component: SubwayComponent;
  let fixture: ComponentFixture<SubwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubwayComponent, SubwayStationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
