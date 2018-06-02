import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SettingsComponent } from '../prototypes/settings-component';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent extends SettingsComponent {

  private _autoFetchInterval = 1;
  private _pullOption = 'ffonly';
  private _tooltip = true;
  private pullOptions = [
    {
      id: 'ffonly',
      name: "Fast-Forward Only (Only pull when your local branch is not ahead)"
    },
    {
      id: 'rebase',
      name: "Rebase (Local commits will be rebase on top of remote)"
    },
    {
      id: 'merge',
      name: "Merge (Ceate merge commit if remote is ahead)"
    }
  ];

  getSettings() {
    let val = this.settings.getAppSetting('gen-autofetchinterval');
    this._autoFetchInterval = val === "" ? 0 : Number(val);
    let opt = this.settings.getAppSetting('gen-pulloption');
    this._pullOption = opt === "" ? 'ffonly' : opt;
    let tp = this.settings.getAppSetting('gen-tooltip');
    this._tooltip = tp === "" ? true : Boolean(tp);
  }

  onIntervalChange(newVal: number) {
    this._autoFetchInterval = Number(newVal);
    this.settings.setSetting('gen-autofetchinterval', this._autoFetchInterval);
  }

  onPullOptionChange() {
    this.settings.setSetting('gen-pulloption', this._pullOption);
  }
  clearCred() {
    this.settings.clearSecureCache();
  }
  updateTooltip(enabled) {

  }
}
