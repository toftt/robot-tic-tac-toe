import { Board, WinStatus } from "./Board";
import { CustomTicTacToeBoard } from "./CustomTicTacToe";

const winningBoards: Array<number> = [
  0b111000000,
  0b000111000,
  0b000000111,
  0b100100100,
  0b010010010,
  0b001001001,
  0b100010001,
  0b001010100
];

export class FullBoard implements Board {
  printEachMove: boolean = false;
  currentBoard: number | null = null;
  private presence: number = 0;
  private color: number = 0;
  private playerOneToMove: boolean = true;
  private boards: Array<CustomTicTacToeBoard> = [];

  constructor() {
    for (let i = 0; i < 9; i++) {
      this.boards.push(new CustomTicTacToeBoard());
    }
  }

  clone() {
    const copy = new FullBoard();
    copy.currentBoard = this.currentBoard;
    copy.presence = this.presence;
    copy.color = this.color;
    copy.playerOneToMove = this.playerOneToMove;
    copy.boards = this.boards.map(board => board.clone());
    return copy;
  }

  private getAvailableMovesForOuterGrid() {
    return new Array(9)
      .fill(undefined)
      .map((_, index) => index)
      .filter(number => {
        const bitMask = 2 ** number;
        return (bitMask & this.presence) === 0;
      });
  }

  getAvailableMoves() {
    if (this.currentBoard !== null)
      return this.boards[this.currentBoard].getAvailableMoves();

    const availableMoves: Array<number> = [];
    this.getAvailableMovesForOuterGrid().forEach(move => {
      const board = this.boards[move];
      if (board.checkStatus() === WinStatus.IN_PROGRESS) {
        board.getAvailableMoves().forEach(innerMove => {
          availableMoves.push(move * 10 + innerMove + 10);
        });
      }
    });

    return availableMoves;
  }

  getPlayerToMove() {
    return this.playerOneToMove ? WinStatus.PLAYER_X : WinStatus.PLAYER_O;
  }

  getLatestPlayerToMove() {
    return this.playerOneToMove ? WinStatus.PLAYER_O : WinStatus.PLAYER_X;
  }

  private updatePresenceAndColor(boardToCheck: number) {
    const board = this.boards[boardToCheck];

    const status = board.checkStatus();
    // lets do nothing for draws for the moment and see how it works out
    if (status !== WinStatus.IN_PROGRESS && status !== WinStatus.DRAW) {
      const bitMask = 2 ** boardToCheck;
      this.presence = this.presence | bitMask;

      if (status === WinStatus.PLAYER_X) {
        this.color = this.color | bitMask;
      }
    }
  }

  performMove(move: number) {
    const outerMove = move < 9 ? this.currentBoard : Math.floor(move / 10) - 1;
    const innerMove = move < 9 ? move : move % 10;

    this.boards[outerMove].performMove(innerMove, this.playerOneToMove);

    const statusOfNextBoard = this.boards[innerMove].checkStatus();

    if (statusOfNextBoard === WinStatus.IN_PROGRESS)
      this.currentBoard = innerMove;
    else {
      this.currentBoard = null;
    }

    this.updatePresenceAndColor(outerMove);

    this.playerOneToMove = !this.playerOneToMove;

    if (this.printEachMove) this.printBoard();
  }

  getBoards() {
    return this.boards.map(board => board.getRows());
  }

  checkStatus() {
    if (
      winningBoards.some(
        board => (this.presence & board & this.color) === board
      )
    )
      return WinStatus.PLAYER_X;

    if (
      winningBoards.some(
        board => (this.presence & board & ~this.color) === board
      )
    )
      return WinStatus.PLAYER_O;

    if (this.getAvailableMoves().length === 0) return WinStatus.DRAW;
    return WinStatus.IN_PROGRESS;
  }

  getOpposedStatus(status: WinStatus) {
    if (status === WinStatus.PLAYER_O) return WinStatus.PLAYER_X;
    return WinStatus.PLAYER_O;
  }
  printBoard() {
    const board = [];
    for (let i = 0; i < 3; i++) {
      const row: string[][] = [[], [], []];
      for (let j = 0; j < 3; j++) {
        const g = i * 3 + j;
        const [a, b, c] = this.boards[g].getPrintedRows();

        row[0].push(a);
        row[1].push(b);
        row[2].push(c);
      }
      const res = row.map(x => x.join("    ")).join("\n");
      board.push(res);
    }
    console.log(
      `
Game status: ${this.checkStatus()} -- Current square: ${
        this.currentBoard !== null ? this.currentBoard + 1 : "None"
      }

${board.join("\n\n")}
`
    );
  }
}
