import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() modeChanged = new EventEmitter<string>();
  private _fileDetail: FileDetail;
  private loading = true;
  private set mode(m: string) {
    this._mode = m;
    this.modeChanged.emit(m);
  }
  private _mode = 'hunk';
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
