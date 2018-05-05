import { TestBed, inject } from '@angular/core/testing';

import { D3Service } from './d3.service';

describe('D3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D3Service]
    });
  });

  it('should be created', inject([D3Service], (service: D3Service) => {
    expect(service).toBeTruthy();
  }));
});
