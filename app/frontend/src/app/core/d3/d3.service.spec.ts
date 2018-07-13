import { TestBed, inject } from '@angular/core/testing';

import { D3Service } from './d3.service';
import { MockCIIntegration } from '../mocks/mock-ci-integration-service';
import { CiIntegrationService } from '../services/ci-integration.service';

describe('D3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        D3Service,
        { provide: CiIntegrationService, useClass: MockCIIntegration }
      ]
    });
  });

  it('should be created', inject([D3Service], (service: D3Service) => {
    expect(service).toBeTruthy();
  }));
});
