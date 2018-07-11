import { EventEmitter } from "../../../../node_modules/@angular/core";

export class MockUpdater {
    isUpdateAvailable = false;
    updateVersion = "";
    updateChecking: EventEmitter<boolean> = new EventEmitter<boolean>();
    updateAvailableChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
    ) {

    }
    checkUpdate() {
    }
    installUpdate() {
    }
    init() {
    }
}
