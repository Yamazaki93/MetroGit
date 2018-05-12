import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPromptComponent } from './tag-prompt.component';

describe('TagPromptComponent', () => {
  let component: TagPromptComponent;
  let fixture: ComponentFixture<TagPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
