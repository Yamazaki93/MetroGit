import { Output, EventEmitter } from "@angular/core";

export class MockLayout {

    isLocalShown = true;
    isRemoteShown = true;
    isTagsShown = true;
    isDetailPanelOpen = false;
    isSubmoduleShown = true;
    set tooltipEnabled(tp) { }
    get tooltipEnabled() { return true; }

    set isNavToggled(val) { }
    get isNavToggled() { return true; }
    set isFilePanelOpen(val) { }
    get isFilePanelOpen() { return true; }

    @Output() filePanelChanged = new EventEmitter<boolean>();
    @Output() navPanelChanged = new EventEmitter<boolean>();
    @Output() tooltipChanged = new EventEmitter<boolean>();
    constructor(
    ) {
    }

}
