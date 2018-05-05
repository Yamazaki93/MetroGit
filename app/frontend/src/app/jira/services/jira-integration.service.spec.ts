import { TestBed, inject } from '@angular/core/testing';

import { JiraIntegrationService } from './jira-integration.service';

describe('JiraIntegrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JiraIntegrationService]
    });
  });

  it('should be created', inject([JiraIntegrationService], (service: JiraIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
