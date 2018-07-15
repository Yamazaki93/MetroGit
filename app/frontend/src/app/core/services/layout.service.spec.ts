import { TestBed, inject } from '@angular/core/testing';

import { LayoutService } from './layout.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { HotkeysService } from '../../../../node_modules/angular2-hotkeys';
import { MockHotkeys } from '../mocks/mock-hotkeys-service';

describe('LayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LayoutService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: HotkeysService, useClass: MockHotkeys}
      ]
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));
});
