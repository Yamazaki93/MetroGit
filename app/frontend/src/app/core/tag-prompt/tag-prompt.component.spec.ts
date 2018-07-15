import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPromptComponent } from './tag-prompt.component';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';

describe('TagPromptComponent', () => {
  let component: TagPromptComponent;
  let fixture: ComponentFixture<TagPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagPromptComponent ],
      schemas: [NO_ERRORS_SCHEMA]
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
