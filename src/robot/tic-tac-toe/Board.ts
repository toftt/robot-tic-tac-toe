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

export interface Board {
  clone(): Board;
  getAvailableMoves(): Array<number>;
  getPlayerToMove(): WinStatus;
  getLatestPlayerToMove(): WinStatus;
  getOpposedStatus(status: WinStatus): WinStatus;
  performMove(move: number): void;
  checkStatus(): WinStatus;
  printBoard(): void;
}

export enum WinStatus {
  IN_PROGRESS = "IN_PROGRESS",
  DRAW = "DRAW",
  PLAYER_X = "PLAYER_X",
  PLAYER_O = "PLAYER_O"
}

export class TicTacToeBoard implements Board {
  presence: number = 0;
  color: number = 0;
  playerOneToMove: boolean = true;
  printEachMove: boolean = false;

  clone() {
    const copy = new TicTacToeBoard();
    copy.presence = this.presence;
    copy.color = this.color;
    copy.playerOneToMove = this.playerOneToMove;
    return copy;
  }

  getAvailableMoves(): Array<number> {
    return new Array(9)
      .fill(undefined)
      .map((_, index) => index)
      .filter(number => {
        const bitMask = 2 ** number;
        return (bitMask & this.presence) === 0;
      });
  }

  getPlayerToMove() {
    return this.playerOneToMove ? WinStatus.PLAYER_X : WinStatus.PLAYER_O;
  }

  getLatestPlayerToMove() {
    return this.playerOneToMove ? WinStatus.PLAYER_O : WinStatus.PLAYER_X;
  }

  performMove(move: number) {
    const bitMask = 2 ** move;

    this.presence = this.presence | bitMask;
    if (this.playerOneToMove) {
      this.color = this.color | bitMask;
    }

    this.playerOneToMove = !this.playerOneToMove;
    if (this.printEachMove) this.printBoard();
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

    if (this.presence === 0b111111111) return WinStatus.DRAW;
    return WinStatus.IN_PROGRESS;
  }

  getOpposedStatus(status: WinStatus) {
    if (status === WinStatus.PLAYER_O) return WinStatus.PLAYER_X;
    return WinStatus.PLAYER_O;
  }

  playRandomGame() {
    this.printBoard();
    while (this.checkStatus() === WinStatus.IN_PROGRESS) {
      const moves = this.getAvailableMoves();
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      this.performMove(randomMove);
    }
  }

  printBoard() {
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
    const boardStatus = `Win status: ${this.checkStatus()}, Player to move: ${this.getPlayerToMove()}`;
    console.log(`${boardStatus}\n${board.join("\n")}`);
  }
}
