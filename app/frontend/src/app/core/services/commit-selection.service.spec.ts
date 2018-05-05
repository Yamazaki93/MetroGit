import { TestBed, inject } from '@angular/core/testing';

import { CommitSelectionService } from './commit-selection.service';

describe('CommitSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommitSelectionService]
    });
  });

  it('should be created', inject([CommitSelectionService], (service: CommitSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
