import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraDetailComponent } from './jira-detail.component';

describe('JiraDetailComponent', () => {
  let component: JiraDetailComponent;
  let fixture: ComponentFixture<JiraDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JiraDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
