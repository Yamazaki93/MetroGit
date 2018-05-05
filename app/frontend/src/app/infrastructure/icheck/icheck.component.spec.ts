import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcheckComponent } from './icheck.component';

describe('IcheckComponent', () => {
  let component: IcheckComponent;
  let fixture: ComponentFixture<IcheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
