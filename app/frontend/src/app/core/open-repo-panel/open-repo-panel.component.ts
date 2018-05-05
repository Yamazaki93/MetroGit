import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { RepoService } from '../services/repo.service';

@Component({
  selector: 'app-open-repo-panel',
  templateUrl: './open-repo-panel.component.html',
  styleUrls: ['./open-repo-panel.component.scss']
})
export class OpenRepoPanelComponent implements OnInit {

  @Input() toggled = false;
  constructor(
    private repoService: RepoService
  ) { }

  ngOnInit() {
  }

  openBrowseDialog() {
    this.repoService.openBrowse();
  }

}
