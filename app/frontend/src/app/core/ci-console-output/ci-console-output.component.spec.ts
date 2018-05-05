import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiConsoleOutputComponent } from './ci-console-output.component';

describe('CiConsoleOutputComponent', () => {
  let component: CiConsoleOutputComponent;
  let fixture: ComponentFixture<CiConsoleOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CiConsoleOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiConsoleOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
