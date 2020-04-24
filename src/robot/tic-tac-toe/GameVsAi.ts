import { MonteCarloTreeSearch } from ".";
import { WinStatus, Board } from "./Board";
import { FullBoard } from "./FullBoard";
// @ts-ignore
import worker from "workerize-loader!../../worker"; // eslint-disable-line

export class GameVsAi {
  private humanPlayer: WinStatus = WinStatus.PLAYER_X;
  private board = new FullBoard();
  private worker: any;
  private resolvePromise: any;

  constructor(humanPlayer: WinStatus = WinStatus.PLAYER_X) {
    this.humanPlayer = humanPlayer;

    this.worker = new worker();
    this.worker.onmessage = (e: any) => {
      console.log(e);
      if (e.data.type === "RPC") return;
      this.resolvePromise(e.data);
    };
  }

  getBoard() {
    return this.board;
  }

  getState() {
    return {
      grid: this.board.getBoards(),
      selectedSquare: this.board.currentBoard,
      currentPlayer: this.board.getPlayerToMove(),
      winStatus: this.board.checkStatus()
    };
  }

  performMove(move: number) {
    if (!this.board.getAvailableMoves().includes(move)) {
      console.log(
        `tried to perform move ${move}.\n available moves are \n ${JSON.stringify(
          this.board.getAvailableMoves()
        )}`
      );
    }
    console.log(`performed move: ${move}`);

    this.board.performMove(move);
    return this.getState();
  }

  async getNextAiMove() {
    const promise = new Promise<any>(resolve => {
      this.resolvePromise = resolve;
    });

    this.worker.postMessage([this.board.exportBoard(), WinStatus.PLAYER_O]);
    const exportedBoard = await promise;
    this.board = FullBoard.importBoard(exportedBoard);
  }
}
