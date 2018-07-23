import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { D3Service } from '../d3/d3.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, AfterViewInit {
  @Input()
  set branches(bch: Branch[]) {
    if (bch) {
      this._branches = bch;
      this.updateBranchVisual();
      this.cd.detectChanges();
    }
  }
  @Input()
  set collapseAll(cp: boolean) {
    this._collapseAll = cp;
  }
  @Input() rootIcon = "";
  @Input() rootPath = "";
  @Input() set itemIcon(icn) {
    this._itemIcon = icn;
    this.updateBranchVisual();
  }
  get itemIcon() {
    return this._itemIcon;
  }
  private _branches = [];
  private items = [];
  private basePad = 25;
  private baseCls = "mr-2";
  private _itemIcon = 'git-branch';
  private _collapseAll = false;
  constructor(
    private d3: D3Service,
    private cd: ChangeDetectorRef
  ) {
    d3.mapChange.subscribe(() => {
      let that = this;
      setTimeout(() => {
        that._branches.forEach(b => {
          if (d3.currentMap && d3.currentMap.nodeDict[b.target]) {
            b.color = d3.colors[d3.currentMap.nodeDict[b.target].x_order % d3.colors.length];
          }
        });
      });

    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // this.cd.detach();
  }
  updateBranchVisual() {
    let rootFolder = { display: this.rootPath, items: [], padding: this.basePad, icon: this.rootIcon };
    if (this._branches) {
      this._branches.forEach(b => {
        let paths = b.shorthand.split('/');
        this.placeBranchInFolder(paths, rootFolder, b, 1);
      });
      this.items = rootFolder.items;
      this._branches.forEach(b => {
        if (this.d3.currentMap && this.d3.currentMap.nodeDict[b.target]) {
          b.color = this.d3.colors[this.d3.currentMap.nodeDict[b.target].x_order % this.d3.colors.length];
        }
      });
    }
  }
  trackBy(index, item) {
    return item.display;
  }

  private placeBranchInFolder(paths, folder, branch, depth) {
    if (paths.length === 1) {
      if (folder.items.map(_ => _.display).indexOf(paths[0]) === -1) {
        branch.padding = 15;
        branch.icon = this.itemIcon;
        branch.display = paths[0];
        folder.items.push(branch);
        folder.items.sort(this.order);
      }
    } else {
      let currentFolderPath = paths[0];
      let currentFolder;
      if (folder.items.filter(_ => _.display === currentFolderPath && _.items).length === 0) {
        let newFolder = { display: currentFolderPath, items: [], padding: 15, icon: 'folder' };
        folder.items.push(newFolder);
        folder.items.sort(this.order);
        currentFolder = newFolder;
      } else {
        currentFolder = folder.items.filter(_ => _.display === currentFolderPath && _.items)[0];
      }
      this.placeBranchInFolder(paths.splice(1, paths.length), currentFolder, branch, depth + 1);
    }
  }
  private order(a, b) {
    if (a.display > b.display) {
      return 1;
    } else {
      return -1;
    }
  }

}

interface BranchFolder {
  items: any[];
  padding: number;
  icon: string;
  display: string;
}

interface Branch {
  display: string;
  shorthand: string;
  padding: number;
}
