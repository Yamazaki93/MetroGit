import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommitSelectionService } from '../services/commit-selection.service';
import { FileDetail } from '../prototypes/file-detail';
import { CommitChangeService } from '../services/commit-change.service';

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
  @Output() modeChange = new EventEmitter<string>();
  @Input()
  set mode(m: string) {
    if (this._mode !== m) {
      this.modeChange.emit(m);
      this.ch.selectFileDetail(this._fileDetail.path, this._fileDetail.commit, m === 'file');
    }
    this._mode = m;
  }
  get mode() {
    return this._mode;
  }
  private _fileDetail: FileDetail;
  private loading = true;
  private _mode = 'hunk';
  constructor(
    private ch: CommitSelectionService,
    private cc: CommitChangeService,
  ) {
    ch.gettingFileDetail.subscribe(() => {
      this._fileDetail = null;
      this.loading = true;
    });
  }

  ngOnInit() {
  }
  stageHunk(hunk) {
    let lines = this.createLineObj(hunk);
    this.cc.stageLines(this._fileDetail.path, lines);
  }
  unstageHunk(hunk) {
    let lines = this.createLineObj(hunk);
    this.cc.unstageLines(this._fileDetail.path, lines);
  }
  stageLine(line) {
    this.cc.stageLines(this._fileDetail.path, [{newLineno: line.newLineno, oldLineno: line.oldLineno}]);
  }
  unstageLine(line) {
    this.cc.unstageLines(this._fileDetail.path, [{newLineno: line.newLineno, oldLineno: line.oldLineno}]);
  }
  private createLineObj(hunk) {
    let lines = [];
    hunk.lines.forEach(l => {
      if (l.op !== '') {
        lines.push({
          oldLineno: l.oldLineno,
          newLineno: l.newLineno
        });
      }
    });
    return lines;
  }
  private isWorkdir(): boolean {
    return this._fileDetail.commit === 'workdir';
  }
  private isTree(): boolean {
    return this._fileDetail.commit === 'tree';
  }
  private isValidLine(line): boolean {
    return line.op && (line.op === '+' || line.op === '-');
  }

}
