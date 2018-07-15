import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSettingsComponent } from './general-settings.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { SettingsService } from '../services/settings.service';
import { MockSettings } from '../mocks/mock-settings-service';

describe('GeneralSettingsComponent', () => {
  let component: GeneralSettingsComponent;
  let fixture: ComponentFixture<GeneralSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [GeneralSettingsComponent],
      providers: [
        { provide: SettingsService, useClass: MockSettings }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
