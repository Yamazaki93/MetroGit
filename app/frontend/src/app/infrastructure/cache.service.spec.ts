import { TestBed, inject } from '@angular/core/testing';

import { CacheService } from './cache.service';
import { ElectronService } from './electron.service';
import { MockElectron } from './mocks/mock-electron-service';
import { StatusBarService } from './status-bar.service';
import { MockStatusBar } from './mocks/mock-status-bar-service';

describe('CacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CacheService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: StatusBarService, useClass: MockStatusBar}
      ],
    });
  });

  it('should be created', inject([CacheService], (service: CacheService) => {
    expect(service).toBeTruthy();
  }));
});
