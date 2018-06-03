import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FileListFilterMask } from './file-list-filter';

@Component({
  selector: 'app-commit-file-list',
  templateUrl: './commit-file-list.component.html',
  styleUrls: ['./commit-file-list.component.scss']
})
export class CommitFileListComponent implements OnInit {

  @Input() files: any[];
  @Output() fileSelected: EventEmitter<string> = new EventEmitter<string>();
  private defaultFilterMask: FileListFilterMask = new FileListFilterMask(true, true, true, true);
  private currentFilter: FileListFilterMask;
  constructor() {
    this.clearFilter();
  }

  ngOnInit() {
  }
  applyFilter(added = false, deleted = false, modified = false, renamed = false) {
    this.currentFilter = new FileListFilterMask(added, deleted, modified, renamed);
  }
  clearFilter() {
    this.currentFilter = this.defaultFilterMask;
  }
  private selectFile(path) {
    this.fileSelected.emit(path);
  }
  private getShortenedPath(path) {
    if (path.length > 65) {
      let front = path.substring(0, 20);
      let over = path.length - 65 - 3;
      let back = path.substring(20 + over, path.length);
      return `${front}...${back}`;
    } else {
      return path;
    }
  }
}
