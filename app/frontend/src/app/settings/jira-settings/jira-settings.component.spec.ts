import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraSettingsComponent } from './jira-settings.component';
import { SettingsService } from '../services/settings.service';
import { MockSettings } from '../mocks/mock-settings-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';

describe('JiraSettingsComponent', () => {
  let component: JiraSettingsComponent;
  let fixture: ComponentFixture<JiraSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JiraSettingsComponent],
      providers: [
        { provide: SettingsService, useClass: MockSettings },
        { provide: ElectronService, useClass: MockElectron }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
