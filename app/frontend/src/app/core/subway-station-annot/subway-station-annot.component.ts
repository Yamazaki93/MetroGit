import { Component, OnInit } from '@angular/core';
import { Node } from '../d3/models/node';
import { RepoService } from '../services/repo.service';
import { D3Service } from '../d3/d3.service';

@Component({
  selector: 'app-subway-station-annot',
  templateUrl: './subway-station-annot.component.html',
  styleUrls: ['./subway-station-annot.component.scss']
})
export class SubwayStationAnnotComponent implements OnInit {

  private height = Node.height;
  private commits = [];
  private refs = {};
  private branchInfos = [];
  private currentBranch = "";
  constructor(
    private repo: RepoService,
    private d3: D3Service,
  ) {
    repo.commitsChange.subscribe(cmts => {
      this.commits = cmts;
    });
    repo.refChange.subscribe(data => {
      this.refs = data.refDict;
      this.updateBranchInfo();
    });
    repo.branchChange.subscribe(bn => {
      this.currentBranch = bn.name;
      this.updateBranchInfo();
    });
    d3.mapChange.subscribe(() => {
      this.updateBranchInfo();
      this.branchInfos.forEach(bi => {
        if (this.d3.currentMap && this.d3.currentMap.nodeDict[bi.target]) {
          bi.color = this.d3.colors[this.d3.currentMap.nodeDict[bi.target].x_order % this.d3.colors.length];
        }
      });
    });
    if (this.repo.hasRepository) {
      this.currentBranch = this.repo.currentBranch.name;
      this.commits = this.repo.getCommitsWithWIP();
      this.refs = this.repo.refDict;
      this.updateBranchInfo();
    }
  }

  ngOnInit() {
  }

  checkout(branchInfo) {
    if (!branchInfo.isTag) {
      this.repo.checkout(branchInfo.shorthand);
    }
  }

  updateBranchInfo(): void {
    let targets = Object.keys(this.refs);
    this.branchInfos = [];
    this.commits.forEach((cmt, i) => {
      if (this.refs[cmt.sha]) {
        let bi = {
          top: this.height * i,
          names: [],
          target: cmt.sha,
        };
        this.refs[cmt.sha].forEach(ref => {
          bi.names.push(ref);
        });
        this.branchInfos.push(bi);
      }
    });
    this.branchInfos.forEach(bi => {
      let consolidated = new Map<string, BranchInfo>();
      bi.names.forEach(na => {
        if (!consolidated[na.display]) {
          consolidated[na.display] = na;
          na.current = false;
        } else {
          consolidated[na.display].isRemote = consolidated[na.display].isRemote || na.isRemote;
          consolidated[na.display].isBranch = consolidated[na.display].isBranch || na.isBranch;
          if (na.isBranch) {
            consolidated[na.display].shorthand = na.shorthand;
          }
        }
      });
      Object.values(consolidated).forEach(con => {
        if (con.isBranch && con.display.includes(this.currentBranch)) {
          con.current = true;
        }
      });
      bi.names = Object.values(consolidated);
      if (this.d3.currentMap && this.d3.currentMap.nodeDict[bi.target]) {
        bi.color = this.d3.colors[this.d3.currentMap.nodeDict[bi.target].x_order % this.d3.colors.length];
      }
    });
  }

}

interface BranchInfo {
  top: number;
  color: string;
  target: string;
  names: [{
    isRemote: boolean,
    isBranch: boolean,
    current: boolean,
    display: string,
    remoteName: string,
    localName: string,
  }];
}
