import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingScreenComponent } from './loading-screen.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LoadingService } from '../loading-service.service';
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications';

describe('LoadingScreenComponent', () => {
  let component: LoadingScreenComponent;
  let fixture: ComponentFixture<LoadingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SimpleNotificationsModule.forRoot()
      ],
      declarations: [ LoadingScreenComponent, SpinnerComponent ],
      providers: [LoadingService, NotificationsService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable and disable correctly', () => {
    component.enabled = true;
    fixture.detectChanges();
    let elem = fixture.nativeElement;
    expect(elem.style.display).toBe('block');
    expect(component.spinner.enabled).toBeTruthy();
    component.enabled = false;
    fixture.detectChanges();
    expect(elem.style.display).toBe('none');
    expect(component.spinner.enabled).toBeFalsy();
  });
});
