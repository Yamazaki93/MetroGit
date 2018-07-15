import { EventEmitter, Output } from "../../../../node_modules/@angular/core";

export class MockLoading {
    get isBusy(): boolean {
        return true;
    }
    @Output()
    messageChange: EventEmitter<string> = new EventEmitter();
    change: EventEmitter<Boolean> = new EventEmitter();

    constructor(
    ) { }
    updateMessage(message) {
    }
    enableLoading(message = "Loading...") {
    }
    disableLoading() {
    }
}
