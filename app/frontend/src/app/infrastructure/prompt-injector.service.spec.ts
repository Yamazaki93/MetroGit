import { TestBed, inject } from '@angular/core/testing';

import { PromptInjectorService } from './prompt-injector.service';

describe('PromptInjectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromptInjectorService]
    });
  });

  it('should be created', inject([PromptInjectorService], (service: PromptInjectorService) => {
    expect(service).toBeTruthy();
  }));
});
