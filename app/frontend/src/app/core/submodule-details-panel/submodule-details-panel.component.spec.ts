import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmoduleDetailsPanelComponent } from './submodule-details-panel.component';

describe('SubmoduleDetailsPanelComponent', () => {
  let component: SubmoduleDetailsPanelComponent;
  let fixture: ComponentFixture<SubmoduleDetailsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmoduleDetailsPanelComponent ]
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
