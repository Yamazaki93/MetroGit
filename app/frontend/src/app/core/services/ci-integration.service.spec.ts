import { TestBed, inject } from '@angular/core/testing';

import { CiIntegrationService } from './ci-integration.service';

describe('CiIntegrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CiIntegrationService]
    });
  });

  it('should be created', inject([CiIntegrationService], (service: CiIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
