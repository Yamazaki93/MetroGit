import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { D3Service } from '../d3/d3.service';

@Component({
  selector: 'app-branch-item',
  templateUrl: './branch-item.component.html',
  styleUrls: ['./branch-item.component.scss']
})
export class BranchItemComponent implements OnInit {

  @Input() item;
  @HostBinding('class.toggled') toggled = true;
  constructor(
    private d3: D3Service
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

}
