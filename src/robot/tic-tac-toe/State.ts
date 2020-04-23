import { Board } from "./Board";

export class State {
  board: Board;
  visitCount: number = 0;
  winScore: number = 0;

  constructor(state?: State) {
    if (state) {
      this.board = state.board.clone();
      this.visitCount = state.visitCount;
      this.winScore = state.winScore;
    }
  }

  getAllPossibleStates() {
    const possibleStates: Array<State> = [];
    const availableMoves = this.board.getAvailableMoves();

    availableMoves.forEach(move => {
      const newState = new State(this);

      newState.board.performMove(move);
      newState.visitCount = 0;
      possibleStates.push(newState);
    });
    return possibleStates;
  }

  incrementVisitCount() {
    this.visitCount++;
  }

  randomPlay() {
    const availableMoves = this.board.getAvailableMoves();
    const randomMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
    this.board.performMove(randomMove);
  }

  addScore(score: number): void {
    if (this.winScore !== Number.MIN_SAFE_INTEGER) {
      this.winScore += score;
    }
  }
}
