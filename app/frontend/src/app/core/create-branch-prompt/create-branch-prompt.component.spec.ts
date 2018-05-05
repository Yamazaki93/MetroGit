import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBranchPromptComponent } from './create-branch-prompt.component';

describe('CreateBranchPromptComponent', () => {
  let component: CreateBranchPromptComponent;
  let fixture: ComponentFixture<CreateBranchPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBranchPromptComponent ]
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
