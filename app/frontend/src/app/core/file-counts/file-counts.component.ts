import { Component, OnInit, Input } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
