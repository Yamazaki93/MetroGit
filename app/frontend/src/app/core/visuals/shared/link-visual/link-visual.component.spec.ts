import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkVisualComponent } from './link-visual.component';
import { NO_ERRORS_SCHEMA, Component, OnInit } from '../../../../../../node_modules/@angular/core';
import { Link } from '../../../d3/models/link';
import { Node } from '../../../d3/models/node';
import { Color } from '../../../d3/models/color';

describe('LinkVisualComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, LinkVisualComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-host',
  template: `<svg:g [linkVisual]="input"></svg:g>`
})
class HostComponent implements OnInit {
  private input: Link;
  ngOnInit(): void {
    let n1 = new Node("1");
    n1.x = 0;
    n1.y = 0;
    let n2 = new Node("2");
    n2.x = 0;
    n2.y = 0;
    n1.commit = {
      sha: "",
      author: "",
      email: "",
      parents: [""],
      message: "",
      date: new Date(),
      ci: "",
      virtual: false,
      isStash: false,
      stashIndex: 0
    };
    n2.commit = n1.commit;
    this.input = new Link(n1, n2);
    this.input.color = new Color(0, 0, 0);
  }
}
