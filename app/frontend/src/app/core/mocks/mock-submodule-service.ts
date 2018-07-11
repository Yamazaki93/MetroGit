import { Output, EventEmitter } from "@angular/core";

export class MockSubmodule {
    @Output() submoduleChanged = new EventEmitter<any[]>();
    @Output() submoduleSelected = new EventEmitter<string>();
    @Output() submoduleDetailChanged = new EventEmitter<any>();
    submodules;
    selectedSubmodule = "";
    submoduleDetails;
    constructor(
    ) {
    }
    selectSubmodule(name) {
    }
    getSubmoduleDetails(name) {
    }
}
