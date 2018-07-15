import { Output, EventEmitter } from "@angular/core";
import { CommitDetail, WIPCommit } from "../prototypes/commit";
import { FileDetail } from "../prototypes/file-detail";

export class MockCommitSelection {
    @Output() selectionChange = new EventEmitter<CommitDetail | WIPCommit>();
    @Output() selectingChange = new EventEmitter<boolean>();
    @Output() selectedFileChange = new EventEmitter<string>();
    @Output() fileDetailChanged = new EventEmitter<FileDetail>();
    @Output() gettingFileDetail = new EventEmitter();
    selectedCommit: CommitDetail | WIPCommit;
    constructor(
    ) {
    }

    selectFileDetail(file, sha = null, fullFile = false) {
    }
    subscribeLiveFileUpdate(file, commit, fullFile) {
    }
    select(commit) {
    }
    openExternalFileView(file, sha = null) {
    }
    reset(commit, mode): void {
    }
    createTag(commit): void {
    }
    deleteTag(name): void {
    }
    deleteBranch(name): void {
    }
    deleteRemoteBranch(name): void {
    }
    unsubscribeFileUpdate(): void {
    }
}
