import { Output, EventEmitter } from "../../../../node_modules/@angular/core";

export class MockSettings {
    @Output() settingsUpdated = new EventEmitter<Settings>();
    settingsData = new Settings;
    constructor(
    ) {
    }

    init() {
    }
    setSetting(key, value) {
    }
    setRepoSetting(key, value) {
    }
    setSecureRepoSetting(key, value) {
    }
    browseFile(): string {
        return "";
    }
    getRepoSetting(key) {
    }
    getSecureRepoSetting(key) {
    }
    getAppSetting(key) {
    }
    clearSecureCache() {
    }
}

class Settings {
    app_settings: Map<string, string>;
    repo_settings: Map<string, string>;
    current_repo: RepoInfo = {
        id: '',
        name: null
    };
}

interface RepoInfo {
    id: string;
    name: string;
}
