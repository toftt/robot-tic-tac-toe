import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GameVsAi } from "./robot/tic-tac-toe/GameVsAi";
import { WinStatus } from "./robot/tic-tac-toe/Board";

const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoardWrapper = styled.div`
  width: 60vmin;
  height: 60vmin;
`;

const TicTacContainer = styled.div<{
  gap?: string;
  isSelected?: boolean;
  isWon?: WinStatus | false;
}>`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);

  grid-gap: ${p => (p.gap ? p.gap : "0")};
  ${p => p.isWon === WinStatus.PLAYER_X && "border: 3px solid blue"}
  ${p => p.isWon === WinStatus.PLAYER_O && "border: 3px solid green"}
  ${p => p.isSelected && "border: 3px solid yellow"}
`;

const DifficultyContainer = styled.div`
  & > button {
    font-size: 1.5rem;
    background-color: white;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    -webkit-appearance: none;

    &:not(:last-child) {
      margin-right: 16px;
    }
  }
`;

const getColor = (state: "empty" | "player1" | "player2") => {
  switch (state) {
    case "empty": {
      return "white";
    }
    case "player1": {
      return "blue";
    }
    case "player2": {
      return "green";
    }
  }
};

const getStateFromWinStatus = (status: WinStatus) => {
  switch (status) {
    case WinStatus.PLAYER_O:
      return "Robot wins! Better luck next time.";
    case WinStatus.PLAYER_X:
      return "You win! Congratulations!";
    case WinStatus.DRAW:
      return "It's a draw!";
    default:
      return "";
  }
};

const Square = styled.div<{ state: "empty" | "player1" | "player2" }>`
  border: 1px solid black;
  background-color: ${p => getColor(p.state)};
`;

const game = new GameVsAi();
export const App = () => {
  const [
    { grid, selectedSquare, currentPlayer, winStatus },
    setGrid
  ] = useState(game.getState());
  const [localSelectedSquare, setLocalSelectedSquare] = useState<number | null>(
    null
  );
  const [difficulty, setDifficulty] = useState<
    "easy" | "intermediate" | "hard" | null
  >(null);

  const handleSquareClick = (idx: number) => {
    if (
      currentPlayer !== WinStatus.PLAYER_X ||
      winStatus !== WinStatus.IN_PROGRESS ||
      game.getBoard().boards[idx].checkStatus() !== WinStatus.IN_PROGRESS
    )
      return;
    if (selectedSquare !== null) return;
    setLocalSelectedSquare(idx);
  };

  const handleBoxClick = (ev: any, squareIdx: number, boxIdx: number) => {
    if (
      currentPlayer !== WinStatus.PLAYER_X ||
      winStatus !== WinStatus.IN_PROGRESS
    )
      return;
    if (selectedSquare === squareIdx) {
      ev.stopPropagation();
      game.performMove(boxIdx);

      setGrid(game.getState());
    }
    if (localSelectedSquare !== squareIdx) return;

    const newState = game.performMove((localSelectedSquare + 1) * 10 + boxIdx);
    setGrid(newState);
  };

  useEffect(() => {
    setLocalSelectedSquare(null);
  }, [selectedSquare]);

  useEffect(() => {
    if (currentPlayer === WinStatus.PLAYER_O) {
      const doThing = async () => {
        if (difficulty === null) return;
        await game.getNextAiMove(difficulty);
        setGrid(game.getState());
      };
      doThing();
    }
  }, [currentPlayer, difficulty]);

  return (
    <FullScreenContainer>
      {difficulty === null ? (
        <DifficultyContainer>
          <h1>Select difficulty</h1>
          <button onClick={() => setDifficulty("easy")}>Easy</button>
          <button onClick={() => setDifficulty("intermediate")}>
            Intermediate
          </button>
          <button onClick={() => setDifficulty("hard")}>Hard</button>
        </DifficultyContainer>
      ) : (
        <BoardWrapper>
          {winStatus !== WinStatus.IN_PROGRESS && (
            <p>{getStateFromWinStatus(winStatus)}</p>
          )}
          {winStatus === WinStatus.IN_PROGRESS ? (
            currentPlayer === WinStatus.PLAYER_X ? (
              <p>It is your turn to move</p>
            ) : (
              <p>Computer is thinking...</p>
            )
          ) : null}
          <TicTacContainer gap="64px">
            {grid.map((square, squareIdx) => (
              <TicTacContainer
                key={squareIdx}
                isWon={
                  [WinStatus.PLAYER_O, WinStatus.PLAYER_X].includes(
                    game.getBoard().boards[squareIdx].checkStatus()
                  ) && game.getBoard().boards[squareIdx].checkStatus()
                }
                isSelected={
                  squareIdx === selectedSquare ||
                  squareIdx === localSelectedSquare
                }
                onClick={() => handleSquareClick(squareIdx)}
              >
                {square.map((box, boxIdx) => (
                  <Square
                    key={boxIdx}
                    onClick={ev => handleBoxClick(ev, squareIdx, boxIdx)}
                    state={box}
                  />
                ))}
              </TicTacContainer>
            ))}
          </TicTacContainer>
        </BoardWrapper>
      )}
    </FullScreenContainer>
  );
};
