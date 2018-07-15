import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdaterComponent } from './updater.component';
import { UpdaterService } from '../../infrastructure/updater.service';
import { MockUpdater } from '../../infrastructure/mocks/mock-updater-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('UpdaterComponent', () => {
  let component: UpdaterComponent;
  let fixture: ComponentFixture<UpdaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdaterComponent ],
      providers: [
        {provide: UpdaterService, useClass: MockUpdater}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
