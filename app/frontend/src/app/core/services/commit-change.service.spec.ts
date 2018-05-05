import { TestBed, inject } from '@angular/core/testing';

import { CommitChangeService } from './commit-change.service';

describe('CommitChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommitChangeService]
    });
  });

  it('should be created', inject([CommitChangeService], (service: CommitChangeService) => {
    expect(service).toBeTruthy();
  }));
});
