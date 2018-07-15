import { Component, OnInit } from '@angular/core';
import { RepoService } from '../services/repo.service';
import { Commit } from '../prototypes/commit';
import { LoadingService } from '../../infrastructure/loading-service.service';

@Component({
  selector: 'app-git-view',
  templateUrl: './git-view.component.html',
  styleUrls: ['./git-view.component.css']
})
export class GitViewComponent implements OnInit {

  private repoName: string = null;
  private commits: Commit[] = [];
  constructor(
    private repoService: RepoService,
    private loading: LoadingService
  ) {
  }

  ngOnInit() {
    let that = this;
    this.repoService.repoChange.subscribe(newRepoName => {
      this.loading.enableLoading();
      setTimeout(() => {
        that.repoName = newRepoName;
        that.loading.disableLoading();
      });
    });
    this.repoService.commitsChange.subscribe(commits => {
      this.commits = commits;
    });
    if (this.repoService.hasRepository) {
      this.loading.enableLoading();
      setTimeout(() => {
        that.repoName = that.repoService.repoName;
        that.commits = that.repoService.getCommitsWithWIP();
        that.loading.disableLoading();
      });
    }

  }

}
