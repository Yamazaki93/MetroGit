import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoProfileComponent } from './repo-profile.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { SettingsService } from '../services/settings.service';
import { MockSettings } from '../mocks/mock-settings-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('RepoProfileComponent', () => {
  let component: RepoProfileComponent;
  let fixture: ComponentFixture<RepoProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepoProfileComponent ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: SettingsService, useClass: MockSettings },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
