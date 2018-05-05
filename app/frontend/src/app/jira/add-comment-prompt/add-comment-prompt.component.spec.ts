import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentPromptComponent } from './add-comment-prompt.component';

describe('AddCommentPromptComponent', () => {
  let component: AddCommentPromptComponent;
  let fixture: ComponentFixture<AddCommentPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommentPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommentPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
