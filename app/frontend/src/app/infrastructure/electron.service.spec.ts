import { TestBed, inject } from '@angular/core/testing';

import { ElectronService } from './electron.service';

describe('ElectronService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService]
    });
  });

  it('should be created', inject([ElectronService], (service: ElectronService) => {
    expect(service).toBeTruthy();
  }));
});
