import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRepoPanelComponent } from './open-repo-panel.component';

describe('OpenRepoPanelComponent', () => {
  let component: OpenRepoPanelComponent;
  let fixture: ComponentFixture<OpenRepoPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenRepoPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenRepoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
