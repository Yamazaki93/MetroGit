import { TestBed, inject } from '@angular/core/testing';

import { AppveyorCiService } from './appveyor-ci.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron-service';
import { ElectronService } from '../../infrastructure/electron.service';
import { SimpleNotificationsModule } from '../../../../node_modules/angular2-notifications';
import { MockLoading } from '../../infrastructure/mocks/mock-loading-service';
import { LoadingService } from '../../infrastructure/loading-service.service';

describe('AppveyorCiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot(),
      ],
      providers: [
        AppveyorCiService,
        { provide: ElectronService, useClass: MockElectron },
        { provide: LoadingService, useClass: MockLoading },
      ]
    });
  });

  it('should be created', inject([AppveyorCiService], (service: AppveyorCiService) => {
    expect(service).toBeTruthy();
  }));
});
