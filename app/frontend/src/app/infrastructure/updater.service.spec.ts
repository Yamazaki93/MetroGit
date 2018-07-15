import { TestBed, inject } from '@angular/core/testing';

import { UpdaterService } from './updater.service';
import { ElectronService } from './electron.service';
import { MockElectron } from './mocks/mock-electron-service';
import { StatusBarService } from './status-bar.service';
import { MockStatusBar } from './mocks/mock-status-bar-service';
import { SimpleNotificationsModule } from '../../../node_modules/angular2-notifications';

describe('UpdaterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot()
      ],
      providers: [
        UpdaterService,
        {provide: ElectronService, useClass: MockElectron},
        {provide: StatusBarService, useClass: MockStatusBar},
      ]
    });
  });

  it('should be created', inject([UpdaterService], (service: UpdaterService) => {
    expect(service).toBeTruthy();
  }));
});
