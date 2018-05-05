import { Commit } from "../../prototypes/commit";
import { Color } from "./color";

export class Node {

    static height = 35;

    commit?: Commit;
    x?: number;
    y?: number;
    color?: Color;
    secondColor?: Color;
    id: string;
    processed = false;
    x_order = 0;

    constructor(id) {
        this.id = id;
    }
}
