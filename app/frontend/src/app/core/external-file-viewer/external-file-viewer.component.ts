import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileDetail } from '../prototypes/file-detail';
import { CommitSelectionService } from '../services/commit-selection.service';
import { LoadingService } from '../../infrastructure/loading-service.service';

@Component({
  selector: 'app-external-file-viewer',
  templateUrl: './external-file-viewer.component.html',
  styleUrls: ['./external-file-viewer.component.scss']
})
export class ExternalFileViewerComponent implements OnInit {

  private path: string;
  private oldPath: string;
  private sha: string;
  private fileDetail: FileDetail;
  private mode = 'hunk';
  constructor(
    private route: ActivatedRoute,
    private selection: CommitSelectionService,
    private loading: LoadingService,
  ) {
    this.loading.enableLoading("Loading File...");
    this.route.params.subscribe(params => {
      this.sha = params['sha'];
    });
    this.selection.fileDetailChanged.subscribe(detail => {
      if (this.path !== detail.path) {
        this.selection.subscribeLiveFileUpdate(detail.path, this.sha, false);
      }
      this.fileDetail = detail;
      this.path = detail.path;
      this.loading.disableLoading();
    });
    this.selection.selectedFileChange.subscribe(path => {
      if (this.path !== path) {
        this.oldPath = this.path;
        this.path = path;
      }
    });
  }

  @HostListener('window:beforeunload')
  unsubscribeUpdate() {
    this.selection.unsubscribeFileUpdate();
  }

  ngOnInit() {
  }

  getTitle() {
    if (this.sha === 'workdir') {
      return "Unstaged Changes";
    } else if (this.sha === 'tree') {
      return "Staged Changes";
    } else {
      return this.sha.substring(0, 6);
    }
  }
}
