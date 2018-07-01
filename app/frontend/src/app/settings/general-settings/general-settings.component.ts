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
  private _cacheCleanupOption = '0';
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
  private cacheCleanupOptions = [
    {
      id: '0',
      name: "Do not auto delete cached files"
    },
    {
      id: '50',
      name: "Keep cached size under 50MB"
    }
  ];

  getSettings() {
    let val = this.settings.getAppSetting('gen-autofetchinterval');
    this._autoFetchInterval = val === "" ? 0 : Number(val);
    let opt = this.settings.getAppSetting('gen-pulloption');
    this._pullOption = opt === "" ? 'ffonly' : opt;
    let opt2 = this.settings.getAppSetting('gen-cachecleanup');
    this._cacheCleanupOption = opt2 === "" ? '0' : opt2;
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
  onCacheCleanupOptionChange() {
    this.settings.setSetting('gen-cachecleanup', this._cacheCleanupOption);
  }
  clearCred() {
    this.settings.clearSecureCache();
  }
  updateTooltip(enabled) {
    this._tooltip = enabled;
    this.settings.setSetting('gen-tooltip', this._tooltip);
  }
}
