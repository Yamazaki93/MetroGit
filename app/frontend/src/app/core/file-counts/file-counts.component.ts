import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-file-counts',
  templateUrl: './file-counts.component.html',
  styleUrls: ['./file-counts.component.scss']
})
export class FileCountsComponent implements OnInit {

  @Input() modified = 0;
  @Input() newCount = 0;
  @Input() deleted = 0;
  @Input() renamed = 0;
  @Output() modifiedClicked = new EventEmitter();
  @Output() newClicked = new EventEmitter();
  @Output() deletedClicked = new EventEmitter();
  @Output() renamedClicked = new EventEmitter();
  private tooltip = true;
  constructor(
    private layout: LayoutService
  ) {
    layout.tooltipChanged.subscribe(tp => {
      this.tooltip = tp;
    });
    this.tooltip = layout.tooltipEnabled;
  }

  ngOnInit() {
  }

}
