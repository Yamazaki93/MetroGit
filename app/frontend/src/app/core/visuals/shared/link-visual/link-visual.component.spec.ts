import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkVisualComponent } from './link-visual.component';

describe('LinkVisualComponent', () => {
  let component: LinkVisualComponent;
  let fixture: ComponentFixture<LinkVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
