import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiSettingsComponent } from './ci-settings.component';

describe('CiSettingsComponent', () => {
  let component: CiSettingsComponent;
  let fixture: ComponentFixture<CiSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CiSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
