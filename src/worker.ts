import { MonteCarloTreeSearch } from "./robot/tic-tac-toe";
import { FullBoard } from "./robot/tic-tac-toe/FullBoard";

const mcst = new MonteCarloTreeSearch();

onmessage = e => {
  const [exportedBoard, winStatus] = e.data;
  const board = FullBoard.importBoard(exportedBoard);
  const nextBoard = mcst.findNextMove(board, winStatus) as FullBoard;
  // @ts-ignore
  postMessage(nextBoard.exportBoard());
};
