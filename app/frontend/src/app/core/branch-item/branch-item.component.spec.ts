import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchItemComponent } from './branch-item.component';

describe('BranchItemComponent', () => {
  let component: BranchItemComponent;
  let fixture: ComponentFixture<BranchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
