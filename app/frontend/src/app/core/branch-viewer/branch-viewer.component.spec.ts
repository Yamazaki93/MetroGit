import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchViewerComponent } from './branch-viewer.component';

describe('NavigationComponent', () => {
  let component: BranchViewerComponent;
  let fixture: ComponentFixture<BranchViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have toggled class only if toggeled is true', () => {
    component.toggled = true;
    fixture.detectChanges();
    let nav_cont = fixture.nativeElement.querySelector('#side-nav');
    expect(nav_cont.getAttribute('class')).toMatch('toggled');
    component.toggled = false;
    fixture.detectChanges();
    expect(nav_cont.getAttribute('class')).not.toContain('toggled');
  });

  it('should show correct toggle button', () => {
    component.toggled = true;
    fixture.detectChanges();
    let nav_cont = fixture.nativeElement.querySelector('#toggle-button span');
    expect(nav_cont.getAttribute('class')).toMatch('icon-chevron-left');
    component.toggled = false;
    fixture.detectChanges();
    expect(nav_cont.getAttribute('class')).toMatch('icon-chevron-right');
  });
  it('should toggle navigation when toggleNavigation is called', () => {
    component.toggled = true;
    component.toggleNavigation();
    expect(component.toggled).toBeFalsy();
  });
});
