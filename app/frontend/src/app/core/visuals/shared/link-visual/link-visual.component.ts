import { Component, Input, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Link } from '../../../d3/models/link';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[linkVisual]',
  templateUrl: './link-visual.component.html',
  styleUrls: ['./link-visual.component.scss']
})
export class LinkVisualComponent implements OnInit, AfterViewInit {

  // tslint:disable-next-line:no-input-rename
  @Input('linkVisual') link: Link;
  linkDirection = -1;
  mergeDirection = 1;
  constructor(
    private cdr: ChangeDetectorRef
  ) {

  }

  ngAfterViewInit() {
    this.cdr.detach();
  }
  ngOnInit(): void {
    if (this.link.target.y > this.link.source.y && this.link.target.x > this.link.source.x) {
      this.linkDirection = 1;
    }
    if (!this.link.merge) {
      this.mergeDirection = -1;
    }
  }
}
