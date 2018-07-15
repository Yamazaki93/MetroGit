import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionSelectorComponent } from './resolution-selector.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { MockJira } from '../../core/mocks/mock-jira-service';
import { SimpleNotificationsModule } from '../../../../node_modules/angular2-notifications';

describe('ResolutionSelectorComponent', () => {
  let component: ResolutionSelectorComponent;
  let fixture: ComponentFixture<ResolutionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [ ResolutionSelectorComponent ],
      providers: [
        {provide: JiraIntegrationService, useClass: MockJira}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
