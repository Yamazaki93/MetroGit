import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiSettingsComponent } from './ci-settings.component';
import { SettingsService } from '../services/settings.service';
import { MockSettings } from '../mocks/mock-settings-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';

describe('CiSettingsComponent', () => {
  let component: CiSettingsComponent;
  let fixture: ComponentFixture<CiSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CiSettingsComponent],
      providers: [
        { provide: SettingsService, useClass: MockSettings },
        { provide: ElectronService, useClass: MockElectron }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
