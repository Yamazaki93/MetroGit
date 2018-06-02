import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { D3Service } from '../d3/d3.service';
import * as moment from 'moment';

@Component({
  selector: 'app-committer-card',
  templateUrl: './committer-card.component.html',
  styleUrls: ['./committer-card.component.scss']
})
export class CommitterCardComponent implements OnInit {

  @Input() set author(a) {
    this.getCommitter(a);
    this._author = a;
  }
  @Input() set email(em) {
    this.getBadgeColor(em);
    this._email = em;
  }
  @Input() set time(t) {
    this.getDateTime(t);
  }
  private authorIcn = "";
  private badgeColor: SafeStyle;
  private timeStr = "";
  private _email = "";
  private _author = "";
  constructor(
    private sanitize: DomSanitizer,
    private d3: D3Service,
  ) { }

  ngOnInit() {
  }
  getBadgeColor(email) {
    this.badgeColor  = this.sanitize.bypassSecurityTrustStyle(`${this.d3.getColorByAuthor(email)}`);
  }
  getDateTime(time) {
    this.timeStr = moment(time).format('MM/DD/YYYY hh:mm a');
  }
  getCommitter(comitter) {
    this.authorIcn = this.d3.getAuthor(comitter);
  }

}
