import { WinStatus } from "./Board";
import { FullBoard } from "./FullBoard";
// @ts-ignore
import worker from "workerize-loader!../../worker"; // eslint-disable-line

const getThinkingTimeForDifficulty = (
  difficulty: "easy" | "intermediate" | "hard"
) => {
  switch (difficulty) {
    case "easy":
      return 1000;
    case "intermediate":
      return 3000;
    case "hard":
      return 6000;
  }
};

export class GameVsAi {
  private humanPlayer: WinStatus = WinStatus.PLAYER_X;
  private board = new FullBoard();
  private worker: any;
  private resolvePromise: any;

  constructor(humanPlayer: WinStatus = WinStatus.PLAYER_X) {
    this.humanPlayer = humanPlayer;

    this.worker = new worker();
    this.worker.onmessage = (e: any) => {
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
      return this.getState();
    }
    console.log(`performed move: ${move}`);

    this.board.performMove(move);
    return this.getState();
  }

  async getNextAiMove(difficulty: "easy" | "intermediate" | "hard") {
    const promise = new Promise<any>(resolve => {
      this.resolvePromise = resolve;
    });

    const timeToThink = getThinkingTimeForDifficulty(difficulty);
    this.worker.postMessage([
      this.board.exportBoard(),
      WinStatus.PLAYER_O,
      timeToThink
    ]);
    const exportedBoard = await promise;
    this.board = FullBoard.importBoard(exportedBoard);
  }
}
