import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiConsoleOutputComponent } from './ci-console-output.component';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

describe('CiConsoleOutputComponent', () => {
  let component: CiConsoleOutputComponent;
  let fixture: ComponentFixture<CiConsoleOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CiConsoleOutputComponent ],
      imports: [
        InfrastructureModule
      ]
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
