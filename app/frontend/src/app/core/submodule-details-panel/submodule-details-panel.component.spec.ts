import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmoduleDetailsPanelComponent } from './submodule-details-panel.component';
import { SubmodulesService } from '../services/submodules.service';
import { MockSubmodule } from '../mocks/mock-submodule-service';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('SubmoduleDetailsPanelComponent', () => {
  let component: SubmoduleDetailsPanelComponent;
  let fixture: ComponentFixture<SubmoduleDetailsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmoduleDetailsPanelComponent ],
      providers: [
        {provide: SubmodulesService, useClass: MockSubmodule}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmoduleDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
