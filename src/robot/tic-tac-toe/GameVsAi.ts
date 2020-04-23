import { MonteCarloTreeSearch } from ".";
import { WinStatus, Board } from "./Board";
import { FullBoard } from "./FullBoard";

export class GameVsAi {
  private mcts: MonteCarloTreeSearch = new MonteCarloTreeSearch();
  private humanPlayer: WinStatus = WinStatus.PLAYER_X;
  private board = new FullBoard();

  constructor(humanPlayer: WinStatus = WinStatus.PLAYER_X) {
    this.humanPlayer = humanPlayer;
  }

  getBoard() {
    return this.board;
  }

  getState() {
    return {
      grid: this.board.getBoards(),
      selectedSquare: this.board.currentBoard,
      currentPlayer: this.board.getPlayerToMove()
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
    this.board = (await this.mcts.findNextMove(
      this.board,
      this.board.getPlayerToMove()
    )) as FullBoard;
  }
}
