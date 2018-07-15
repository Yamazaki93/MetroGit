import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBranchPromptComponent } from './create-branch-prompt.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';

describe('CreateBranchPromptComponent', () => {
  let component: CreateBranchPromptComponent;
  let fixture: ComponentFixture<CreateBranchPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBranchPromptComponent ],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBranchPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
