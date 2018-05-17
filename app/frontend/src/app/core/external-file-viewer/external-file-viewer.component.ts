import { Component, OnInit } from '@angular/core';
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
  private sha: string;
  private fileDetail: FileDetail;
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
      this.fileDetail = detail;
      this.path = detail.path;
      this.loading.disableLoading();
    });
  }

  ngOnInit() {
  }
}
