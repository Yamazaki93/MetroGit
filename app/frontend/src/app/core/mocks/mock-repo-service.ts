import { Output, EventEmitter } from "@angular/core";
import { Branch } from "../prototypes/branch";

export class MockRepo {
    @Output() repoChange = new EventEmitter<string>();
    @Output() wipInfoChange = new EventEmitter();
    @Output() branchChange = new EventEmitter<Branch>();
    @Output() commitsChange = new EventEmitter<any[]>();
    @Output() refChange = new EventEmitter<any>();
    @Output() pulling = new EventEmitter<boolean>();
    @Output() pushing = new EventEmitter<boolean>();
    @Output() posUpdate = new EventEmitter<{ ahead: number, behind: number }>();

    commits: any[] = [];
    repoName = "";
    hasRepository = false;
    currentBranch: Branch;
    refDict = {};
    refs = [];
    remote = "";
    currentPos: { ahead: number, behind: number };
    pulloption = "";

    constructor(
    ) {
    }

    init(): void {
    }

    getCommitsWithWIP() {
    }

    notifyCommitDifference(newCommits) {
    }

    openRepo(workingDir): void {
    }

    openBrowse(): void {
    }

    fetch(): void {
    }

    pull(): void {
    }

    push(force = false): void {
    }

    createBranch(): void {
    }

    checkout(shorthand): void {
    }
    pushTag(name, toDelete = false): void {
    }
    retry(): void {
    }
    removeRepoSetting(workingDir) {
    }
    browseInitFolder() {
    }
}
