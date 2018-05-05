import { Node } from './node';
import { Color } from './color';

export class Link {

    color?: Color;
    merge = false;
    source: Node;
    target: Node;

    constructor(source, target) {
        this.source = source;
        this.target = target;
    }
}
