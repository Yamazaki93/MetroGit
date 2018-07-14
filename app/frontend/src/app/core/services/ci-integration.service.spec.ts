import { TestBed, inject } from '@angular/core/testing';

import { CiIntegrationService } from './ci-integration.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { StatusBarService } from '../../infrastructure/status-bar.service';
import { RepoService } from './repo.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { MockRepo } from '../mocks/mock-repo-service';
import { MockStatusBar } from '../../infrastructure/mocks/mock-status-bar-service';

describe('CiIntegrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CiIntegrationService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: StatusBarService, useClass: MockStatusBar},
        {provide: RepoService, useClass: MockRepo}
      ]
    });
  });

  it('should be created', inject([CiIntegrationService], (service: CiIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
