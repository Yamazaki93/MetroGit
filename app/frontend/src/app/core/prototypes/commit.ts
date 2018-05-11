export interface Commit {
    sha: string;
    author: string;
    email: string;
    parents: string[];
    message: string;
    date: Date;
    ci: string;
    virtual: boolean;
    isStash: boolean;
    stashIndex: number;
}

export interface CommitDetail extends Commit {
    files: [{
        path: string;
        isModified: boolean;
        isDeleted: boolean;
        isAdded: boolean;
        isRenamed: boolean;
    }];
    fileSummary: {
        added: number;
        deleted: number;
        modified: number;
        renamed: number;
    };
}

export interface WIPCommit extends Commit {
    staged: [{
        path: string;
        isNew: boolean;
        isModified: boolean;
        isRenamed: boolean;
        isIgnored: boolean;
        isDeleted: boolean;
    }];
    unstaged: [{
        path: string;
        isNew: boolean;
        isModified: boolean;
        isRenamed: boolean;
        isIgnored: boolean;
        isDeleted: boolean;
    }];
    stagedSummary: {
        ignored: number;
        newCount: number;
        deleted: number;
        modified: number;
        renamed: number;
    };
    unstagedSummary: {
        ignored: number;
        newCount: number;
        deleted: number;
        modified: number;
        renamed: number;
    };
}
