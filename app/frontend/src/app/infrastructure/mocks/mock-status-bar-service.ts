import { Output, EventEmitter } from "../../../../node_modules/@angular/core";

export class MockStatusBar {
    @Output() statusChange = new EventEmitter<Status>();
    constructor() { }

    enableLoading(message) {
    }
    disableLoading() {
    }
    flash(type, message) {
    }
    private hide() {
    }
}

interface Status {
    loading: boolean;
    type: string;
    message: string;
    show: boolean;
}
