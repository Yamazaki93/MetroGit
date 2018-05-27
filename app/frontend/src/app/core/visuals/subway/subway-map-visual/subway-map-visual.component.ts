import { Component, OnInit, Input, ViewChild, AfterViewInit, AfterViewChecked, OnChanges, HostBinding, ChangeDetectorRef, QueryList, OnDestroy } from '@angular/core';
import { SubwayMap } from '../../../d3/models/subway-map';
import { D3Service } from '../../../d3/d3.service';
import { Node } from '../../../d3/models/node';
import { Commit } from '../../../prototypes/commit';
import { CiIntegrationService } from '../../../services/ci-integration.service';
import { NodeVisualComponent } from '../../shared/node-visual/node-visual.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-subway-map-visual',
  templateUrl: './subway-map-visual.component.html',
  styleUrls: ['./subway-map-visual.component.scss']
})
export class SubwayMapVisualComponent implements OnInit, AfterViewInit, OnDestroy {


  @Input('commits') set commits(cmts) {
    let that = this;
    if (!that._commits) {
      that._commits = cmts;
      that.graph = that.d3Service.getSubwayMap(that._commits);
      this.graph.initGraph(this.svg);
      that.d3Service.getCIStatus();
      that._updateWidth();
      that.cdr.detectChanges();
    } else {
      setTimeout(() => {
        that.d3Service.updateCommits(cmts);
        that._commits = cmts;
        that._updateHeight();
        that._updateWidth();
        that.graph.initGraph(that.svg);
        that.cdr.detectChanges();
      });
    }
  }
  @ViewChild('svg') svg;
  @ViewChild('nodeVisual') nodeVisuals: QueryList<NodeVisualComponent>;
  @HostBinding('style.height.px') height;
  @HostBinding('style.width.px') width = 500;
  private _commits: Commit[];
  private subs: Subscription;
  graph: SubwayMap;

  constructor(
    private d3Service: D3Service,
    private ciService: CiIntegrationService,
    private cdr: ChangeDetectorRef,
  ) {
    this.subs = this.d3Service.mapChange.subscribe(() => {
      if (this.graph) {
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    // this._updateHeight();
  }
  ngAfterViewInit(): void {
    this.cdr.detach();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private _updateHeight() {
    this.height = Math.max(this._commits.length * Node.height + 10, 55);
  }
  private _updateWidth() {
    this.width = Math.min(Math.max(this.graph.width * 50 + 20 + 3, 55), 600);
  }
}
