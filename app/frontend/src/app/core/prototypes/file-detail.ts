
export interface FileDetail {
    paths: string[];
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
}
