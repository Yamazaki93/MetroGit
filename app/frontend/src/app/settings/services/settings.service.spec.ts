import { TestBed, inject } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { SimpleNotificationsModule } from '../../../../node_modules/angular2-notifications';

describe('SettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot()
      ],
      providers: [
        SettingsService,
        { provide: ElectronService, useClass: MockElectron },
      ]
    });
  });

  it('should be created', inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  }));
});
