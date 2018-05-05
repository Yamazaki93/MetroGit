import { Node } from './node';
import { Link } from './link';

import * as d3 from 'd3';
import { ElementRef } from '@angular/core';

export class SubwayMap {
    public nodes: Node[] = [];
    public links: Link[] = [];
    public nodeDict: any;
    public get initialized(): boolean {
        return this._initialized;
    }
    public width = 0;
    private _initialized = false;
    private eleRef: ElementRef;
    constructor(nodes, links, nodeDict) {
        this.nodes = nodes;
        this.links = links;
        this.nodeDict = nodeDict;
    }

    initGraph(element: ElementRef) {
        let svg = d3.select(element.nativeElement);
        d3.selectAll('.commit-info .background')
            .data(this.nodes)
            .style('background', function (d) { return d.color.stringValue; });
        this.eleRef = element;
        this._initialized = true;
    }

    scrollTo(commit: string) {
        let node = document.getElementById(`commit-info-${commit}`);
        if (node) {
            node.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }
    }

    updateCommitStatus(commit: string, status: string) {
        if (this.nodeDict[commit]) {
            this.nodeDict[commit].commit.ci = status;
        }
    }
}
