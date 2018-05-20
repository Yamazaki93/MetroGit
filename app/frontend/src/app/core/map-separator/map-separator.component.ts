import { Component, OnInit, Input } from '@angular/core';
import { Commit } from '../prototypes/commit';
import { Node } from '../d3/models/node';
import * as moment from 'moment';

@Component({
  selector: 'app-map-separator',
  templateUrl: './map-separator.component.html',
  styleUrls: ['./map-separator.component.scss']
})
export class MapSeparatorComponent implements OnInit {

  @Input()
  set commits(cmts: Commit[]) {
    this._commits = cmts;
    this.processSeparators();
  }
  private _commits: Commit[];
  private separators = [
    new Sep(moment().subtract(1, 'hour')),
    new Sep(moment().subtract(6, 'hour')),
    new Sep(moment().subtract(12, 'hour')),
    new Sep(moment().subtract(1, 'day')),
    new Sep(moment().subtract(2, 'day')),
    new Sep(moment().subtract(3, 'day')),
    new Sep(moment().subtract(4, 'day')),
    new Sep(moment().subtract(5, 'day')),
    new Sep(moment().subtract(6, 'day')),
    new Sep(moment().subtract(1, 'week')),
    new Sep(moment().subtract(2, 'week')),
    new Sep(moment().subtract(3, 'week')),
    new Sep(moment().subtract(1, 'month')),
    new Sep(moment().subtract(2, 'month')),
    new Sep(moment().subtract(3, 'month')),
    new Sep(moment().subtract(4, 'month')),
    new Sep(moment().subtract(5, 'month')),
    new Sep(moment().subtract(6, 'month')),
  ];
  private height = Node.height;
  constructor() { }

  ngOnInit() {
  }

  processSeparators() {
    this.separators.map(sep => { sep.visible = false; });
    for (let j = 0; j < this.separators.length; j++) {
      // update times
      this.separators[j].time.add(moment().diff(this.separators[j].baseTime, 'second'), 'second');
      this.separators[j].baseTime = moment();
    }
    for (let i = 1; i < this._commits.length; i++) {
      let cmt = this._commits[i];
      let cmtTime = moment(cmt.date);
      for (let j = 0; j < this.separators.length; j++) {
        let sep = this.separators[j];
        if (j < this.separators.length - 1 &&
          !sep.visible && cmtTime.diff(sep.time) < 0 && cmtTime.diff(this.separators[j + 1].time) > 0) {
          sep.commit = cmt.sha;
          sep.top = this.height * i;
          sep.visible = true;
          break;
        } else if (j === this.separators.length - 1 && !sep.visible && cmtTime.diff(sep.time) < 0) {
          sep.commit = cmt.sha;
          sep.top = this.height * i;
          sep.visible = true;
          break;
        }
      }
    }
  }

}

class Sep {
  top = 0;
  visible = false;
  commit = "";
  time: moment.Moment;
  baseTime: moment.Moment;
  constructor(t: moment.Moment) {
    this.time = t;
    this.baseTime = moment();
  }

  get display(): string {
    let diffHr = moment().diff(this.time, 'hour');
    let diffDay = moment().diff(this.time, 'day');
    let diffWeek = moment().diff(this.time, 'week');
    let diffMonth = moment().diff(this.time, 'month');
    if (diffMonth) {
      return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    } else if (diffWeek) {
      return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    } else if (diffDay) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHr) {
      return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    }
  }
}
