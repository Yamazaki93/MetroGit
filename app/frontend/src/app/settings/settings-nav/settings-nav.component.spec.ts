import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNavComponent } from './settings-nav.component';
import { RouterTestingModule } from '../../../../node_modules/@angular/router/testing';
import { SettingsService } from '../services/settings.service';
import { MockSettings } from '../mocks/mock-settings-service';

describe('SettingsNavComponent', () => {
  let component: SettingsNavComponent;
  let fixture: ComponentFixture<SettingsNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ SettingsNavComponent ],
      providers: [
        {provide: SettingsService, useClass: MockSettings}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
