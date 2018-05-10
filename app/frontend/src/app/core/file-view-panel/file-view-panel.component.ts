import { Component, OnInit, Input } from '@angular/core';
import { CommitSelectionService } from '../services/commit-selection.service';
import { FileDetail } from '../prototypes/file-detail';

@Component({
  selector: 'app-file-view-panel',
  templateUrl: './file-view-panel.component.html',
  styleUrls: ['./file-view-panel.component.scss']
})
export class FileViewPanelComponent implements OnInit {

  detail: FileDetail;
  constructor(
    private selection: CommitSelectionService
  ) {
    selection.fileDetailChanged.subscribe(detail => {
      this.detail = detail;
    });
  }

  ngOnInit() {
  }

}
