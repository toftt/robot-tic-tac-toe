import { Node } from "./Node";

export class Tree {
  root: Node;

  constructor() {
    this.root = new Node({ type: "empty" });
  }
}
