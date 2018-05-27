import { Component, OnInit, Input } from '@angular/core';
import { SubmodulesService } from '../services/submodules.service';

@Component({
  selector: 'app-submodule-details-panel',
  templateUrl: './submodule-details-panel.component.html',
  styleUrls: ['./submodule-details-panel.component.scss']
})
export class SubmoduleDetailsPanelComponent implements OnInit {

  @Input() toggled = false;
  @Input() set submoduleName(n) {
    this._name = n;
    this.submodules.getSubmoduleDetails(n);
  }
  path = "";
  hid = "";
  message = "";
  detail = "";
  private _name = "";
  constructor(
    private submodules: SubmodulesService
  ) {
    submodules.submoduleDetailChanged.subscribe(result => {
      this.path = result.path;
      this.hid = result.hid.substring(0, 6);
      this.message = result.message;
      this.detail = result.detail;
    });
  }

  ngOnInit() {
  }

}
