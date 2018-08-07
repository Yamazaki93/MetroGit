import { Output, EventEmitter } from "../../../../node_modules/@angular/core";
import { Issue } from "../../jira/models/issue";
import { Resolution } from "../../jira/models/resolution";
import { Profile } from "../../jira/models/profile";

// putting mock jira service here for now
// pending refactor to extract JIRA integration to external plugin
export class MockJira {
    @Output() issueRetrieved: EventEmitter<Issue> = new EventEmitter<Issue>();
    @Output() subtaskRetrieved: EventEmitter<Issue> = new EventEmitter<Issue>();
    @Output() enabledChanged = new EventEmitter<boolean>();
    @Output() assignableRetrieved = new EventEmitter<{ key: string, result: Profile[] }>();
    @Output() issueQueryRetrieved: EventEmitter<Issue[]> = new EventEmitter<Issue[]>();
    @Output() resolutionRetrieved: EventEmitter<Resolution[]> = new EventEmitter<Resolution[]>();
    @Output() changeIssue: EventEmitter<string> = new EventEmitter<string>();
    @Output() previousIssueStateChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() nextIssueStateChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    enabled = false;
    jiraUrl = "";
    resolutions: Resolution[] = [];
    constructor(
    ) {
    }
    parseKeyFromMessage(message, detail) {
    }
    getIssue(key) {
    }
    addComment(key, body) {
    }
    updateIssue(key, fields, transition) {
    }
    findAssignableUsers(key, search = "") {
    }
    assignIssue(key, name) {
    }
    addSubtask(key, name, projectId) {
    }
    searchIssuesByKey(keyQuery, fields?) {
    }
    searchIssuesBySummary(textQuery, fields?) {
    }
    navigateToIssue(key) {
    }
    pushPrevious(key) {
    }
}
