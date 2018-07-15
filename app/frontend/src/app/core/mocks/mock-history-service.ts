import { Output, EventEmitter } from "../../../../node_modules/@angular/core";

export class MockHistory {
    @Output() historyChange = new EventEmitter<any>();
    repos = [];
    constructor(
    ) {
    }
}
