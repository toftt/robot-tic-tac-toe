import { MonteCarloTreeSearch } from "./robot/tic-tac-toe";
import { FullBoard } from "./robot/tic-tac-toe/FullBoard";

const mcst = new MonteCarloTreeSearch();

onmessage = e => {
  const [exportedBoard, winStatus, thinkTime] = e.data;
  const board = FullBoard.importBoard(exportedBoard);
  const nextBoard = mcst.findNextMove(board, winStatus, thinkTime) as FullBoard;
  // @ts-ignore
  postMessage(nextBoard.exportBoard());
};
