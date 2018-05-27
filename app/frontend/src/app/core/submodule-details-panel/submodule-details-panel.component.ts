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
  private details;
  private _name = "";
  constructor(
    private submodules: SubmodulesService
  ) {
    submodules.submoduleDetailChanged.subscribe(result => {
      this.details = result;
    });
  }

  ngOnInit() {
  }

}
