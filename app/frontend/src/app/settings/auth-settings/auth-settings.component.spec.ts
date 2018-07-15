import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSettingsComponent } from './auth-settings.component';
import { SettingsService } from '../services/settings.service';
import { MockSettings } from '../mocks/mock-settings-service';
import { NgbModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

describe('AuthSettingsComponent', () => {
  let component: AuthSettingsComponent;
  let fixture: ComponentFixture<AuthSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot()
      ],
      declarations: [AuthSettingsComponent],
      providers: [
        { provide: SettingsService, useClass: MockSettings }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
