import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcePushPromptComponent } from './force-push-prompt.component';

describe('ForcePushPromptComponent', () => {
  let component: ForcePushPromptComponent;
  let fixture: ComponentFixture<ForcePushPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcePushPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcePushPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
