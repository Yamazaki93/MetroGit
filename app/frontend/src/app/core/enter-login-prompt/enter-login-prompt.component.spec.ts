import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterLoginPromptComponent } from './enter-login-prompt.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';

describe('EnterLoginPromptComponent', () => {
  let component: EnterLoginPromptComponent;
  let fixture: ComponentFixture<EnterLoginPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterLoginPromptComponent ],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterLoginPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
