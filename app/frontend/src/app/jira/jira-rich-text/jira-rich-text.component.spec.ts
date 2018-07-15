import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraRichTextComponent } from './jira-rich-text.component';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { MockJira } from '../../core/mocks/mock-jira-service';

describe('JiraRichTextComponent', () => {
  let component: JiraRichTextComponent;
  let fixture: ComponentFixture<JiraRichTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JiraRichTextComponent ],
      providers: [
        {provide: JiraIntegrationService, useClass: MockJira}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraRichTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
