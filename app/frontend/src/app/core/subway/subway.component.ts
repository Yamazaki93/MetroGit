import { Component, OnInit, Input } from '@angular/core';
import { Commit } from '../prototypes/commit';
import { Node } from '../d3/models/node';
import { Link } from '../d3/models/link';
import { Color } from '../d3/models/color';
import { RepoService } from '../services/repo.service';

@Component({
  selector: 'app-subway',
  templateUrl: './subway.component.html',
  styleUrls: ['./subway.component.css']
})
export class SubwayComponent implements OnInit {

  @Input() commits: Commit[];
  hasRepo = false;
  constructor(private repo: RepoService) {
    this.hasRepo = repo.hasRepository;
    if (repo.hasRepository) {
      this.commits = repo.commits;
    }
    repo.repoChange.subscribe(name => {
      if (!name) {
        this.hasRepo = false;
      } else {
        this.hasRepo = true;
      }
    });
  }

  ngOnInit() {
  }

}
