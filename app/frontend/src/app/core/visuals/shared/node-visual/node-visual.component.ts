import { Component, Input, ChangeDetectorRef, AfterViewChecked, AfterViewInit, HostBinding, OnDestroy, ViewChild } from '@angular/core';
import { Node } from '../../../d3/models/node';
import { D3Service } from '../../../d3/d3.service';
import { CommitSelectionService } from '../../../services/commit-selection.service';
import { Subscription } from 'rxjs/Subscription';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { CommitChangeService } from '../../../services/commit-change.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.scss']
})
export class NodeVisualComponent implements OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('nodeVisual') node: Node;
  @Input('graphWidth') graphWidth = 500;
  @ViewChild('commitMenu') public basicMenu: ContextMenuComponent;
  private selected = false;
  private subs: Subscription;
  constructor(private cdr: ChangeDetectorRef, private selection: CommitSelectionService, private commit: CommitChangeService) {
    this.subs = selection.selectionChange.subscribe(cmt => {
      if (cmt && cmt.sha === this.node.commit.sha) {
        this.selected = true;
      } else {
        this.selected = false;
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  select($event) {
    this.selection.select(this.node.commit.sha);
  }
  onResetHard() {
    this.selection.reset(this.node.commit.sha, 'hard');
  }
  onResetSoft() {
    this.selection.reset(this.node.commit.sha, 'soft');
  }
  onPopStash() {
    this.commit.pop(this.node.commit.stashIndex);
  }
  onApplyStash() {
    this.commit.apply(this.node.commit.stashIndex);
  }
  onDeleteStash() {
    this.commit.deleteStash(this.node.commit.stashIndex);
  }
  onCreateTag() {
    this.selection.createTag(this.node.commit.sha);
  }
}
