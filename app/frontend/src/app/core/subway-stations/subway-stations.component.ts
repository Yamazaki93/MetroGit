import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Commit } from '../prototypes/commit';
import { Node } from '../d3/models/node';
import { D3Service } from '../d3/d3.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommitSelectionService } from '../services/commit-selection.service';
import { Subscription } from 'rxjs/Subscription';
import { RepoService } from '../services/repo.service';
import { CommitChangeService } from '../services/commit-change.service';
import { ContextMenuComponent } from 'ngx-contextmenu/lib/contextMenu.component';
import { ContextMenuService } from 'ngx-contextmenu';

@Component({
  selector: 'app-subway-stations',
  templateUrl: './subway-stations.component.html',
  styleUrls: ['./subway-stations.component.scss']
})
export class SubwayStationsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  set commits(cmts: Commit[]) {
    this._commits = cmts;
    this.cdr.detectChanges();
  }
  @ViewChild('commitMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('stashMenu') public stashMenu: ContextMenuComponent;


  private _commits: Commit[];
  private selected: string;
  private height = Node.height - 8;
  private subs: Subscription[] = [];
  constructor(
    private d3Service: D3Service,
    private sanitize: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private selection: CommitSelectionService,
    private repo: RepoService,
    private commitChange: CommitChangeService,
    private ctxService: ContextMenuService
  ) {
    this.subs.push(this.selection.selectionChange.subscribe(commit => {
      this.selected = commit ? commit.sha : null;
      this.cdr.detectChanges();
    }));
    this.subs.push(this.repo.wipInfoChange.subscribe(() => {
      this.cdr.detectChanges();
    }));
    this.subs.push(this.commitChange.messageChange.subscribe(msg => {
      this.cdr.detectChanges();
    }));
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cdr.detach();
  }
  select(sha) {
    this.selection.select(sha);
  }
  ngOnDestroy() {
    this.subs.map(s => {
      s.unsubscribe();
    });
  }
  getColorByAuthor(commit: Commit) {
    return this.sanitize.bypassSecurityTrustStyle(`${this.d3Service.getColorByAuthor(commit.email)}`);
  }
  tryOpenMenu($event: MouseEvent, item: any) {
    if (!item.virtual && !item.isStash) {
      this.ctxService.show.next({
        contextMenu: this.basicMenu,
        event: $event,
        item: item,
      });
    } else if (item.isStash) {
      this.ctxService.show.next({
        contextMenu: this.stashMenu,
        event: $event,
        item: item,
      });
    }
    $event.preventDefault();
    $event.stopPropagation();
  }
  onResetHard(sha) {
    this.selection.reset(sha, 'hard');
  }
  onResetSoft(sha) {
    this.selection.reset(sha, 'soft');
  }
  onPopStash(index) {
    this.commitChange.pop(index);
  }
  onApplyStash(index) {
    this.commitChange.apply(index);
  }
  onDeleteStash(index) {
    this.commitChange.deleteStash(index);
  }
}
