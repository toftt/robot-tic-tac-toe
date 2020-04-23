import { Node } from "./Node";

export class UCT {
  static uctValue(totalVisit: number, nodeWinScore: number, nodeVisit: number) {
    if (nodeVisit === 0) {
      return Number.MAX_SAFE_INTEGER;
    }

    return (
      nodeWinScore / nodeVisit +
      1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit)
    );
  }

  static findBestNodeWithUCT(node: Node): Node {
    if (node.children.length === 0)
      throw new Error("Node can not have 0 children");

    const parentVisit = node.state.visitCount;

    const childrenWithUCTValues = node.children.map(child => ({
      node: child,
      value: this.uctValue(
        parentVisit,
        child.state.winScore,
        child.state.visitCount
      )
    }));

    const max = childrenWithUCTValues.reduce((maxNode, candidate) => {
      if (maxNode.value > candidate.value) return maxNode;
      return candidate;
    }, childrenWithUCTValues[0]);

    return max.node;
  }
}
