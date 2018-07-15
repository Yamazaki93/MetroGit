import { TestBed, inject } from '@angular/core/testing';

import { HistoryService } from './history.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';

describe('HistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HistoryService,
        {provide: ElectronService, useClass: MockElectron}
      ]
    });
  });

  it('should be created', inject([HistoryService], (service: HistoryService) => {
    expect(service).toBeTruthy();
  }));
});
