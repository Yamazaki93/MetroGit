
export interface FileDetail {
    commit: string;
    paths: string[];
    path: string;
    hunks: [
        {
            lines: [{
                op: string;
                content: string;
                oldLineno: number;
                newLineno: number;
            }]
        }
    ];
    summary: {
        added: number,
        removed: number,
    };
}
