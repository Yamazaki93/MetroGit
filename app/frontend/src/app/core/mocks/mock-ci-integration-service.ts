import { Output, EventEmitter } from "../../../../node_modules/@angular/core";

export class MockCIIntegration {
    @Output() buildsUpdated = new EventEmitter<any>();
    @Output() enabledChanged = new EventEmitter<boolean>();
    buildResults: any;

    enabled = false;
    constructor(
    ) {
    }

    init() {

    }
}
