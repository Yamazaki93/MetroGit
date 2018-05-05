import { TestBed, inject } from '@angular/core/testing';

import { StatusBarService } from './status-bar.service';

describe('StatusBarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusBarService]
    });
  });

  it('should be created', inject([StatusBarService], (service: StatusBarService) => {
    expect(service).toBeTruthy();
  }));
});
