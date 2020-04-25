export interface Board {
  clone(): Board;
  getAvailableMoves(): Array<number>;
  getPlayerToMove(): WinStatus;
  getLatestPlayerToMove(): WinStatus;
  getOpposedStatus(status: WinStatus): WinStatus;
  performMove(move: number): void;
  checkStatus(): WinStatus;
  printBoard(): void;
  isEqual(board: any): boolean;
}

export enum WinStatus {
  IN_PROGRESS = "IN_PROGRESS",
  DRAW = "DRAW",
  PLAYER_X = "PLAYER_X",
  PLAYER_O = "PLAYER_O",
}
