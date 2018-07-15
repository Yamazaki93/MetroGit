import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSelectorComponent } from './profile-selector.component';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { MockJira } from '../../core/mocks/mock-jira-service';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('ProfileSelectorComponent', () => {
  let component: ProfileSelectorComponent;
  let fixture: ComponentFixture<ProfileSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ProfileSelectorComponent],
      providers: [
        { provide: JiraIntegrationService, useClass: MockJira }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
