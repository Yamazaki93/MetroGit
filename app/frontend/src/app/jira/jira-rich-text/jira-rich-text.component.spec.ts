import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraRichTextComponent } from './jira-rich-text.component';

describe('JiraRichTextComponent', () => {
  let component: JiraRichTextComponent;
  let fixture: ComponentFixture<JiraRichTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JiraRichTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraRichTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
