import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SshPasswordPromptComponent } from './ssh-password-prompt.component';

describe('SshPasswordPromptComponent', () => {
  let component: SshPasswordPromptComponent;
  let fixture: ComponentFixture<SshPasswordPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SshPasswordPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SshPasswordPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
