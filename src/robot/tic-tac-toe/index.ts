import { UCT } from "./UCT";
import { WinStatus, Board } from "./Board";
import { Node } from "./Node";
import { Tree } from "./Tree";

export class MonteCarloTreeSearch {
  static readonly WIN_SCORE: number = 10;
  private tree: Tree;

  constructor() {
    this.tree = new Tree();
  }

  private initialize(board: Board) {
    this.tree = new Tree();
    this.tree.root.state.board = board.clone();
  }

  private assignRootNode(board: Board) {
    const nodeToStartFrom = this.tree.root.children.find((child) =>
      child.state?.board.isEqual(board)
    );
    console.log("found valid node");

    if (nodeToStartFrom) this.tree.root = nodeToStartFrom;
    else this.initialize(board);
  }

  findNextMove(board: Board, winStatus: WinStatus, thinkTime: number) {
    const opponent = board.getOpposedStatus(winStatus);

    this.assignRootNode(board);

    const rootNode = this.tree.root;

    const end = new Date().valueOf() + thinkTime;
    let x = 0;
    while (new Date().valueOf() < end) {
      x++;
      // selection
      const promisingNode = this.selectPromisingNode(rootNode);
      // expansion
      if (promisingNode.state.board.checkStatus() === WinStatus.IN_PROGRESS) {
        this.expandNode(promisingNode);
      }

      // simulation
      let nodeToExplore = promisingNode;
      if (promisingNode.children.length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode();
      }

      const playoutResult = this.simulateRandomPlayout(nodeToExplore, opponent);

      // update
      this.backPropogation(nodeToExplore, playoutResult);
    }

    console.log(`ran ${x} iterations`);
    const winnerNode = rootNode.getChildWithMaxScore();
    this.tree.root = winnerNode;
    return winnerNode.state.board;
  }

  private selectPromisingNode(rootNode: Node): Node {
    let node = rootNode;
    while (node.children.length !== 0) {
      node = UCT.findBestNodeWithUCT(node);
    }
    return node;
  }

  private expandNode(node: Node): void {
    const possibleStates = node.state.getAllPossibleStates();
    possibleStates.forEach((state) => {
      const newNode = new Node({ type: "state", state });
      newNode.parent = node;
      node.children.push(newNode);
    });
  }

  private simulateRandomPlayout(node: Node, opponent: WinStatus) {
    const tempNode = new Node({ type: "node", node });
    const tempState = tempNode.state;
    let boardStatus = tempState.board.checkStatus();

    if (boardStatus === opponent) {
      tempNode.parent.state.winScore = Number.MIN_SAFE_INTEGER;
      return boardStatus;
    }

    while (boardStatus === WinStatus.IN_PROGRESS) {
      tempState.randomPlay();
      boardStatus = tempState.board.checkStatus();
    }

    return boardStatus;
  }

  private backPropogation(nodeToExplore: Node, playoutResult: WinStatus) {
    let tempNode = nodeToExplore;

    while (tempNode) {
      tempNode.state.incrementVisitCount();
      if (tempNode.state.board.getLatestPlayerToMove() === playoutResult) {
        tempNode.state.addScore(MonteCarloTreeSearch.WIN_SCORE);
      }
      tempNode = tempNode.parent;
    }
  }
}
