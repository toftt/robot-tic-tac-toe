import { WinStatus } from "./Board";

const winningBoards: Array<number> = [
  0b111000000,
  0b000111000,
  0b000000111,
  0b100100100,
  0b010010010,
  0b001001001,
  0b100010001,
  0b001010100,
];

interface ExportedBoard {
  presence: number;
  color: number;
}
export class CustomTicTacToeBoard {
  presence: number = 0;
  color: number = 0;
  lastPerformedMove: WinStatus | null = null;
  printEachMove: boolean = false;

  clone() {
    const copy = new CustomTicTacToeBoard();
    copy.presence = this.presence;
    copy.color = this.color;
    copy.lastPerformedMove = this.lastPerformedMove;
    return copy;
  }

  isEqual(board: CustomTicTacToeBoard) {
    return board.presence === this.presence && board.color === this.color;
  }

  static importBoard(board: ExportedBoard) {
    const newBoard = new CustomTicTacToeBoard();
    newBoard.presence = board.presence;
    newBoard.color = board.color;
    return newBoard;
  }

  exportBoard(): ExportedBoard {
    return {
      presence: this.presence,
      color: this.color,
    };
  }

  getAvailableMoves(): Array<number> {
    if (this.checkStatus() !== WinStatus.IN_PROGRESS) return [];

    return new Array(9)
      .fill(undefined)
      .map((_, index) => index)
      .filter((number) => {
        const bitMask = 2 ** number;
        return (bitMask & this.presence) === 0;
      });
  }

  performMove(move: number, playerOneToMove: boolean) {
    const bitMask = 2 ** move;

    this.presence = this.presence | bitMask;
    if (playerOneToMove) {
      this.color = this.color | bitMask;
    }
  }

  checkStatus() {
    if (
      winningBoards.some(
        (board) => (this.presence & board & this.color) === board
      )
    )
      return WinStatus.PLAYER_X;

    if (
      winningBoards.some(
        (board) => (this.presence & board & ~this.color) === board
      )
    )
      return WinStatus.PLAYER_O;

    if (this.presence === 0b111111111) return WinStatus.DRAW;
    return WinStatus.IN_PROGRESS;
  }

  getOpposedStatus(status: WinStatus) {
    if (status === WinStatus.PLAYER_O) return WinStatus.PLAYER_X;
    return WinStatus.PLAYER_O;
  }

  getRows() {
    return new Array(9)
      .fill(undefined)
      .map((_, index) => index)
      .map((number) => {
        const bitMask = 2 ** number;
        if ((bitMask & this.presence) === 0) return "empty";
        else if ((bitMask & this.presence & this.color) === 0) return "player2";
        return "player1";
      });
  }

  getPrintedRows(): string[] {
    const board = [];

    for (let i = 0; i < 3; i++) {
      const row = [];

      for (let j = 0; j < 3; j++) {
        const move = i * 3 + j;
        if ((2 ** move) & this.presence) {
          const player = (2 ** move) & this.color;
          row.push(player ? "x" : "o");
        } else row.push(" ");
      }
      board.push(`| ${row.join(" ")} |`);
    }

    return board;
  }
}
