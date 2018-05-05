import { TestBed, inject } from '@angular/core/testing';

import { AppveyorCiService } from './appveyor-ci.service';

describe('AppveyorCiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppveyorCiService]
    });
  });

  it('should be created', inject([AppveyorCiService], (service: AppveyorCiService) => {
    expect(service).toBeTruthy();
  }));
});
