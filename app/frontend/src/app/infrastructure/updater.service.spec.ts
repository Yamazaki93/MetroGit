import { TestBed, inject } from '@angular/core/testing';

import { UpdaterService } from './updater.service';

describe('UpdaterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdaterService]
    });
  });

  it('should be created', inject([UpdaterService], (service: UpdaterService) => {
    expect(service).toBeTruthy();
  }));
});
