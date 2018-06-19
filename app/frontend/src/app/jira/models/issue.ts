import { KeyedItem } from "./keyed-item";
import { Profile } from "./profile";
import { IssueType } from "./issue-type";
import { Priority } from "./priority";
import { Status } from "./status";
import { Subtask } from "./subtask";
import { Comment } from "./comment";
import { Transition } from "./transition";

export interface Issue extends KeyedItem {
    fields: {
        issuetype: IssueType;
        project: {
            id: string;
            key: string;
            name: string;
            avatarUrls: {
                "48x48": string;
                "24x24": string;
                "16x16": string;
                "32x32": string;
            },
        }
        resolution: {
            name: string;
        },
        resolutiondate: Date;
        created: Date;
        priority: Priority;
        assignee: Profile;
        description: string;
        status: Status;
        summary: string;
        creator: Profile;
        reporter: Profile;
        subtasks: Subtask[];
        comment: {
            comments: Comment[];
            total: number;
        };

        storyPoints?: number;
    };
    transitions: Transition[];
    editmeta: {
        fields: any;
    };
}
