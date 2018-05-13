import { Component, OnInit, Input, HostBinding, ViewChild } from '@angular/core';
import { D3Service } from '../d3/d3.service';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { CommitSelectionService } from '../services/commit-selection.service';

@Component({
  selector: 'app-branch-item',
  templateUrl: './branch-item.component.html',
  styleUrls: ['./branch-item.component.scss']
})
export class BranchItemComponent implements OnInit {

  @Input() item;
  @HostBinding('class.toggled') toggled = true;
  @ViewChild('tagMenu') tagMenu: ContextMenuComponent;
  constructor(
    private d3: D3Service,
    private ctxService: ContextMenuService,
    private commitSelection: CommitSelectionService,
  ) { }

  ngOnInit() {
  }

  onClick($event) {
    if (this.item.items) {
      this.toggled = !this.toggled;
    } else {
      this.d3.scrollTo(this.item.target);
    }
    $event.stopPropagation();
  }

  trackBy(index, item) {
    return item.display;
  }
  tryOpenMenu($event: MouseEvent, item: any) {
    if (item.isTag) {
      this.ctxService.show.next({
        contextMenu: this.tagMenu,
        event: $event,
        item: item,
      });
    }
    $event.preventDefault();
    $event.stopPropagation();
  }
  onDeleteTag(name) {
    this.commitSelection.deleteTag(name);
  }
}
