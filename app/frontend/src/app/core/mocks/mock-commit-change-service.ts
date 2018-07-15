import { Output, EventEmitter } from "@angular/core";

export class MockCommitChange {

    @Output() messageChange = new EventEmitter<string>();
    @Output() detailChange = new EventEmitter<string>();
    @Output() stashed = new EventEmitter();
    @Output() popped = new EventEmitter();
    @Output() commitingChange = new EventEmitter<boolean>();
    defaultKey = "";
    set newCommitMessage(msg) {
    }
    get newCommitMessage() {
        return "";
    }
    set newCommitDetail(msg) {
    }
    get newCommitDetail() {
        return null;
    }
    constructor(
    ) {
    }

    init() {

    }
    stage(paths): void {
    }
    stageLines(path, lines) {
    }
    unstage(paths): void {
    }
    unstageLines(path, lines) {
    }
    commit(paths): void {
    }
    commitStaged(): void {
    }
    stash(): void {
    }
    pop(index = -1): void {
    }
    apply(index = -1): void {
    }
    deleteStash(index): void {
    }
    discardAll(): void {
    }
    tryCommit(): void {
    }
}
