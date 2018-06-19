import { KeyedItem } from "./keyed-item";
import { IssueType } from "./issue-type";
import { Priority } from "./priority";
import { Status } from "./status";
import { SafeResourceUrl } from "@angular/platform-browser";
import { Transition } from "./transition";

export interface Subtask extends KeyedItem {
    fields: {
        summary: string,
        status: Status;
        priority: Priority;
        issuetype: IssueType;
        safePriorityIconUrl?: SafeResourceUrl;
    };
    transitions: Transition[];
    editmeta: {
        fields: any;
    };
}
