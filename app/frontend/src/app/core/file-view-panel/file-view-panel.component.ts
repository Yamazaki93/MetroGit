import { Component, OnInit, Input } from '@angular/core';
import { CommitSelectionService } from '../services/commit-selection.service';
import { FileDetail } from '../prototypes/file-detail';

@Component({
  selector: 'app-file-view-panel',
  templateUrl: './file-view-panel.component.html',
  styleUrls: ['./file-view-panel.component.scss']
})
export class FileViewPanelComponent implements OnInit {

  @Input()
  set detail(fd: FileDetail) {
    this._fileDetail = fd;
    if (fd) {
      this.loading = false;
    }
  }
  private _fileDetail: FileDetail;
  private loading = true;
  constructor(
    private ch: CommitSelectionService
  ) {
    ch.gettingFileDetail.subscribe(() => {
      this._fileDetail = null;
      this.loading = true;
    });
  }

  ngOnInit() {
  }

}
