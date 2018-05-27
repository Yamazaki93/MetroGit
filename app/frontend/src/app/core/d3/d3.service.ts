import { Injectable, EventEmitter, Output } from '@angular/core';
import { Link } from './models/link';
import { Node } from './models/node';
import { SubwayMap } from './models/subway-map';
import { Commit } from '../prototypes/commit';

import * as d3 from 'd3';
import { Color } from './models/color';
import { ElectronService } from '../../infrastructure/electron.service';
import { CiIntegrationService } from '../services/ci-integration.service';

@Injectable()
export class D3Service {

  colors = [
    '#058ED9',
    '#880044',
    '#875053',
    '#129490',
    '#E5A823',
    '#0055A2',
    '#96C5F7'];
  currentMap: SubwayMap = null;
  @Output() mapChange = new EventEmitter();
  private ciEnabled = false;
  constructor(
    private ci: CiIntegrationService,
  ) {
    ci.enabledChanged.subscribe(en => {
      this.ciEnabled = en;
      this.getCIStatus();
    });
    ci.buildsUpdated.subscribe(newBuilds => {
      if (this.ciEnabled) {
        Object.keys(newBuilds).map(key => {
          let b = newBuilds[key];
          this.updateCommitStatus(b.commit, b.overall);
        });
        this.mapChange.emit();
      }
    });
  }

  init() {

  }

  getCIStatus() {
    if (this.ciEnabled) {
      Object.keys(this.ci.buildResults).map(key => {
        let b = this.ci.buildResults[key];
        this.updateCommitStatus(b.commit, b.overall);
      });
      this.mapChange.emit();
    } else {
      this.clearCommitsCIStatus();
    }
  }

  getSubwayMap(commits: Commit[]) {
    let _start = 25;
    let _offset = Node.height;
    let _infinityY = Node.height * (commits.length + 1);
    let nodeDict = {};
    let nodes = [];
    let links = [];
    let treeOffset = 0;
    let that = this;
    commits.forEach((c, i) => {
      let node = new Node(c.sha);
      // Y offset, just increment;
      node.y = _start;
      // X is tricky, do it later
      node.x = _start;
      node.commit = c;
      node.color = Color.parseHex(that.colors[0]);
      node.secondColor = Color.parseHex(that.colors[0]);
      nodes.push(node);
      nodeDict[node.commit.sha] = node;
    }, this);
    // edge creation
    commits.forEach((c) => {
      if (c.parents.length === 0) {
        let infinityNode = new Node('infty-' + c.sha);
        infinityNode.x = nodeDict[c.sha].x;
        infinityNode.y = _infinityY;
        let newLink = new Link(nodeDict[c.sha], infinityNode);
        newLink.color = nodeDict[c.sha].color;
        links.push(newLink);
      } else {
        c.parents.forEach((p) => {
          if (nodeDict[p]) {
            let newLink = new Link(nodeDict[c.sha], nodeDict[p]);
            if (c.parents.length > 1) {
              newLink.color = nodeDict[p].color;
              nodeDict[c.sha].secondColor = nodeDict[p].color;
              newLink.merge = true;
            } else {
              newLink.color = nodeDict[c.sha].color;
              newLink.merge = false;
            }
            links.push(newLink);
          }
        });
      }
    });
    this.currentMap = new SubwayMap(nodes, links, nodeDict);
    this.updateMapLayout(this.currentMap);
    this.mapChange.emit();
    return this.currentMap;
  }

  updateCommits(newCommits: Commit[]) {
    let links = this.currentMap.links;
    let nodes = this.currentMap.nodes;
    let nodeDict = this.currentMap.nodeDict;
    let _start = 25;
    let _offset = Node.height;
    if (this.currentMap) {
      // remove not exist commits
      let removed = [];
      let newKeys = newCommits.map(c => c.sha);
      let oldKeys = Object.keys(nodeDict);
      oldKeys.forEach(k => {
        if (newKeys.indexOf(k) === -1) {
          removed.push(k);
        }
      });
      removed.forEach(k => {
        this.currentMap.nodes.splice(this.currentMap.nodes.indexOf(nodeDict[k]), 1);
        delete nodeDict[k];
      });
      // add in new commits in correct place
      let i = 0;
      let j = 0;
      // newCommits will be >= than old nodes now
      // since we remove all nodes in old that's not in new
      while (i < newCommits.length || j < nodes.length) {
        if (j >= nodes.length || nodes[j].commit.sha !== newCommits[i].sha) {
          // if node is not in already, create new one
          let node = new Node(newCommits[i].sha);
          // Y offset, just increment;
          node.y = _start;
          // X is tricky, do it later
          node.x = _start;
          node.commit = newCommits[i];
          node.color = Color.parseHex(this.colors[0]);
          node.secondColor = Color.parseHex(this.colors[0]);
          if (j < nodes.length) {
            nodes.splice(j, 0, node);
          } else {
            nodes.splice(nodes.length, 0, node);
          }
          nodeDict[node.commit.sha] = node;
        }
        j += 1;
        i += 1;
      }
      this.currentMap.nodes.map(n => {
        n.processed = false;
      });
      this.currentMap.links = [];
      // edge creation
      let _infinityY = Node.height * (nodes.length + 1);
      nodes.forEach((n) => {
        let c = n.commit;
        if (c.parents.length === 0) {
          let infinityNode = new Node('infty-' + c.sha);
          infinityNode.x = nodeDict[c.sha].x;
          infinityNode.y = _infinityY;
          let newLink = new Link(nodeDict[c.sha], infinityNode);
          newLink.color = nodeDict[c.sha].color;
          this.currentMap.links.push(newLink);
        } else {
          c.parents.forEach((p) => {
            if (nodeDict[p]) {
              let newLink = new Link(nodeDict[c.sha], nodeDict[p]);
              if (c.parents.length > 1) {
                newLink.color = nodeDict[p].color;
                nodeDict[c.sha].secondColor = nodeDict[p].color;
                newLink.merge = true;
              } else {
                newLink.color = nodeDict[c.sha].color;
                newLink.merge = false;
              }
              this.currentMap.links.push(newLink);
            }
          });
        }
      });
      this.updateMapLayout(this.currentMap);
      this.getCIStatus();
      this.mapChange.emit();
      return this.currentMap;
    }
  }

  updateMapLayout(map: SubwayMap) {
    let _start = 25;
    let _offset = Node.height;
    let nodes = map.nodes;
    let nodeDict = map.nodeDict;
    // New x algorithm, branch lines, closed and open concept
    // let's see, start from top, start a "branch line" and add that commit, mark as open
    // a merge commit comes in, add one parent in it's line, add another to "new branch", mark open
    // a commit is removed from nodeDict if processed
    // any new commits, add to a existing branch if "it's sha is any of existing's parent", if all fail, put it in new branch line
    // a branch line can only close if "a commit with only 1 parent and that parent is already in a branch" comes in
    let branchLines: BranchLine[] = [];
    function placeNodeInNewOrClosed(node: Node): BranchLine {
      let addedToBl = null;
      branchLines.forEach(bl => {
        if (!node.processed) {
          // now a bl can be closed if all the commits in there is after this node
          // let allAfter = bl.nodes.every(bln => nodes.indexOf(bln) > nodes.indexOf(node));
          // check if any parent is above this node but that node is after this node
          // let's see if this works better
          // let parentAbove = bl.nodes.find(bln => {
          //   if (!bln.commit.parents.length) {
          //     return false;
          //   } else {
          //     return (!bln.commit.parents.every(parent => nodes.indexOf(nodeDict[parent]) > nodes.indexOf(node)) && nodes.indexOf(bln) > nodes.indexOf(node));
          //   }
          // });
          let lastCross = !bl.nodes[bl.nodes.length - 1].commit.parents.every(parent => {
            return nodes.indexOf(nodeDict[parent]) > nodes.indexOf(node);
          });
          if (lastCross) {
            // bl.open = false;
          }

          if (!bl.open) {
            addedToBl = bl;
            bl.nodes.push(node);
            bl.open = true;
            node.processed = true;
          }
        }
      });
      if (!addedToBl) {
        // still can't add, create a new branch
        branchLines.push({ nodes: [node], open: true });
        addedToBl = branchLines[branchLines.length - 1];
        node.processed = true;
      }
      return addedToBl;
    }
    function placeNodeInExisting(node: Node): BranchLine {
      let addedToBl = null;
      branchLines.forEach(bl => {
        if (!node.processed) {
          if (bl.nodes[bl.nodes.length - 1].commit.parents[0] === node.commit.sha) {
            // else if a bl's last node is it's parent
            // it's impossible for anything other than the last one to be the parent
            // because that whould have been a merge which is processed in special case
            addedToBl = bl;
            bl.nodes.push(node);
            node.processed = true;
          }
        }
      });
      return addedToBl;
    }
    function processParents(n: Node, bl: BranchLine) {
      // pecial case for it's parents, always put the first with itself
      let parent0 = nodeDict[n.commit.parents[0]];
      let processGrandparent0 = false;
      if (parent0 && !parent0.processed) {
        bl.nodes.push(parent0);
        if (nodeDict[n.commit.parents[0]].commit.parents.length > 1) {
          processGrandparent0 = true;
        }
        nodeDict[n.commit.parents[0]].processed = true;
      }
      // if there's a second parent, try to place that too
      let parent1 = nodeDict[n.commit.parents[1]];
      let newbl;
      let processGrandparent = false;
      if (parent1 && !parent1.processed) {
        if (!placeNodeInExisting(parent1)) {
          if (parent1.commit.parents.length > 1) {
            processGrandparent = true;
          }
          newbl = placeNodeInNewOrClosed(parent1);
        }
      }
      if (processGrandparent0) {
        processParents(nodeDict[n.commit.parents[0]], bl);
      }
      if (processGrandparent) {
        processParents(parent1, newbl);
      }
    }
    nodes.forEach((n, i) => {
      n.y = _start + i * _offset;
      let currentSha = n.commit.sha;
      // if this node is unprocessed
      if (!n.processed) {
        let addedToBl = null;
        // see if I can add to an existing branch
        addedToBl = placeNodeInExisting(n);
        if (!addedToBl) {
          addedToBl = placeNodeInNewOrClosed(n);   // this method must return a bl
        }
        processParents(n, addedToBl);
      }
      // check for closed branch line, make it available for adding
      branchLines.forEach(bl => {
        if (bl.nodes[bl.nodes.length - 1].commit.parents.indexOf(currentSha) !== -1) {
          bl.open = false;
        }
      });
    });
    // process all branch lines
    let that = this;
    branchLines.forEach((bl, i) => {
      bl.nodes.forEach(n => {
        n.x = _start + i * _offset;
        n.color.setHex(that.colors[i % that.colors.length]);
        n.x_order = i;
      });
    });
    map.width = branchLines.length;
  }

  scrollTo(commit: string) {
    this.currentMap.scrollTo(commit);
  }

  updateCommitStatus(commit: string, status: string) {
    if (this.ciEnabled && this.currentMap) {
      this.currentMap.updateCommitStatus(commit, status);
    }
  }
  clearCommitsCIStatus() {
    if (this.currentMap) {
      this.currentMap.nodes.map(n => {
        n.commit.ci = '';
      });
    }
  }

  getAuthor(author) {
    let firstChars = author.split(' ').map(n => n.length > 0 ? n[0].toUpperCase() : "");
    let name = "";
    firstChars.forEach(f => {
      if (f > 'A' && f < 'Z' && name.length < 2) {
        name += f;
      }
    });
    return name;
  }

  private hashCode(str) { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      // tslint:disable-next-line:no-bitwise
      hash = str.charCodeAt(i) + (((hash << 4) + hash * 2) >> 2);
    }
    return hash;
  }
  private intToRGB(i) {
    // tslint:disable-next-line:no-bitwise
    let c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  getColorByAuthor(email: string) {
    return `#${this.intToRGB(this.hashCode(email))}`;
  }
}

interface BranchLine {
  nodes: Node[];
  open: boolean;
}
