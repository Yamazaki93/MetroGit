import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SshPasswordPromptComponent } from './ssh-password-prompt.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';

describe('SshPasswordPromptComponent', () => {
  let component: SshPasswordPromptComponent;
  let fixture: ComponentFixture<SshPasswordPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
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
