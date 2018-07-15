import { Output, EventEmitter } from "../../../../node_modules/@angular/core";

export class MockAppVeyor {
    @Output() buildsUpdated = new EventEmitter<any>();
    @Output() enabledChanged = new EventEmitter<boolean>();
    @Output() logRetrieved = new EventEmitter<{ build: string, output: string }>();

    buildResults;
    enabled;
    constructor(
    ) {

    }

    init() {

    }

    openAppveyor(commit) {
    }

    getBuildLog(commit) {
    }

    rebuildAppveyor(commit) {
    }

}
