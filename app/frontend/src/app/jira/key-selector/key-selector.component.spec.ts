import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeySelectorComponent } from './key-selector.component';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { MockJira } from '../../core/mocks/mock-jira-service';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('KeySelectorComponent', () => {
  let component: KeySelectorComponent;
  let fixture: ComponentFixture<KeySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [KeySelectorComponent],
      providers: [
        { provide: JiraIntegrationService, useClass: MockJira }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
