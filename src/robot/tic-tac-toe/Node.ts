import { State } from "./State";

type Arguments =
  | {
      type: "empty";
    }
  | {
      type: "state";
      state: State;
    }
  | {
      type: "state-parent-children";
      state: State;
      parent: Node;
      children: Array<Node>;
    }
  | {
      type: "node";
      node: Node;
    };

export class Node {
  state: State;
  children: Array<Node>;
    // @ts-ignore
  parent: Node;

  constructor(args: Arguments) {
    switch (args.type) {
      case "empty": {
        this.state = new State();
        this.children = [];
        break;
      }
      case "state": {
        this.state = args.state;
        this.children = [];
        break;
      }
      case "state-parent-children": {
        this.state = args.state;
        this.parent = args.parent;
        this.children = args.children;
        break;
      }
      case "node": {
        const { node } = args;

        this.children = [];
        this.state = new State(node.state);

        if (node.parent) {
          this.parent = node.parent;
        }

        node.children.forEach(child => {
          this.children.push(new Node({ type: "node", node: child }));
        });
        break;
      }
    }
  }

  getRandomChildNode() {
    return this.children[Math.floor(Math.random() * this.children.length)];
  }

  getChildWithMaxScore(): Node {
    return this.children.reduce((maxNode, candidate) => {
      if (maxNode.state.visitCount > candidate.state.visitCount) return maxNode;
      return candidate;
    }, this.children[0]);
  }

  print() {
    console.log("---------------------------------------------------");
    console.log(
      `count: ${this.state.visitCount} score: ${this.state.winScore}`
    );
    this.state.board.printBoard();
    console.log("-------------------children------------------------");
    this.children.forEach(child => child.print());
    console.log("---------------------------------------------------");
    console.log();
  }
}
