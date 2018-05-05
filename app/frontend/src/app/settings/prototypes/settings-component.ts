import { SettingsService } from "../services/settings.service";
import { OnInit, Component } from "@angular/core";

@Component({})
export abstract class SettingsComponent implements OnInit {

    constructor(
        protected settings: SettingsService
    ) {
        settings.settingsUpdated.subscribe(sett => {
            this.getSettings();
        });
        this.settings = settings;
    }
    abstract getSettings();
    ngOnInit(): void {
        this.getSettings();
    }
}
