import { TestBed, inject } from '@angular/core/testing';

import { SubmodulesService } from './submodules.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';

describe('SubmodulesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubmodulesService,
        {provide: ElectronService, useClass: MockElectron}
      ]
    });
  });

  it('should be created', inject([SubmodulesService], (service: SubmodulesService) => {
    expect(service).toBeTruthy();
  }));
});
