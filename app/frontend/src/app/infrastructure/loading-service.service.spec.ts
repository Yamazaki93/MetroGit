import { TestBed, inject } from '@angular/core/testing';

import { LoadingService } from './loading-service.service';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

describe('LoadingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot()
      ],
      providers: [LoadingService, NotificationsService]
    });
  });

  it('should be created', inject([LoadingService], (service: LoadingService) => {
    expect(service).toBeTruthy();
  }));

  it('should emit change when enabling/disabling loading', inject([LoadingService], (service: LoadingService) => {
    let emit = false;
    let result = null;
    service.change.subscribe(e => {
      result = e;
      emit = true;
    });
    service.enableLoading();
    expect(emit).toBeTruthy();
    expect(result).toBeTruthy();
    emit = false;
    result = null;
    service.disableLoading();
    expect(emit).toBeTruthy();
    expect(result).toBeFalsy();
  }));

  it('should only emit once on multiple enable loading', inject([LoadingService], (service: LoadingService) => {
    let emitCount = 0;
    service.change.subscribe(e => {
      emitCount += 1;
    });
    service.enableLoading();
    service.enableLoading();
    expect(emitCount).toBe(1);
  }));

  it('should only emit change to disabled when all enable call has been met with disable', inject([LoadingService], (service: LoadingService) => {
    let result = null;
    service.change.subscribe(e => {
      result = e;
    });
    service.enableLoading();
    service.enableLoading();
    service.disableLoading();
    expect(result).toBeTruthy();
    service.disableLoading();
    expect(result).toBeFalsy();
    // test disable shouldn't below 0
    service.disableLoading();
    service.enableLoading();
    expect(result).toBeTruthy();
  }));

  it('should emit proper message when enabling', inject([LoadingService], (service: LoadingService) => {
    let message = "";
    service.messageChange.subscribe(msg => {
      message = msg;
    });
    service.enableLoading();
    expect(message).toBe("Loading...");
    service.enableLoading('test');
    expect(message).toBe('test');
  }));
});
