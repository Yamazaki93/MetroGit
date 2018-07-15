import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskPromptComponent } from './subtask-prompt.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';

describe('SubtaskPromptComponent', () => {
  let component: SubtaskPromptComponent;
  let fixture: ComponentFixture<SubtaskPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ SubtaskPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtaskPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
