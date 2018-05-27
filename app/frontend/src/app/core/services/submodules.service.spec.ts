import { TestBed, inject } from '@angular/core/testing';

import { SubmodulesService } from './submodules.service';

describe('SubmodulesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubmodulesService]
    });
  });

  it('should be created', inject([SubmodulesService], (service: SubmodulesService) => {
    expect(service).toBeTruthy();
  }));
});
