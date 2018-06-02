import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeySelectorComponent } from './key-selector.component';

describe('KeySelectorComponent', () => {
  let component: KeySelectorComponent;
  let fixture: ComponentFixture<KeySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
