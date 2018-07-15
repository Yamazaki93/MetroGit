import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsComponent } from './profile-settings.component';
import { SettingsService } from '../services/settings.service';
import { MockSettings } from '../mocks/mock-settings-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { FormsModule } from '../../../../node_modules/@angular/forms';

describe('ProfileSettingsComponent', () => {
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSettingsComponent ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: SettingsService, useClass: MockSettings },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
