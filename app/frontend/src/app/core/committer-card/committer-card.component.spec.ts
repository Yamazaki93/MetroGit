import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitterCardComponent } from './committer-card.component';

describe('CommitterCardComponent', () => {
  let component: CommitterCardComponent;
  let fixture: ComponentFixture<CommitterCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitterCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
