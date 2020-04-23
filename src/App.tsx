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
  width: 60%;
  height: 60%;
`;

const TicTacContainer = styled.div<{ gap?: string; isSelected?: boolean }>`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);

  grid-gap: ${p => (p.gap ? p.gap : "0")};
  ${p => p.isSelected && "border: 3px solid green"}
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
const Square = styled.div<{ state: "empty" | "player1" | "player2" }>`
  border: 1px solid black;
  background-color: ${p => getColor(p.state)};
`;

const game = new GameVsAi();
export const App = () => {
  const [{ grid, selectedSquare, currentPlayer }, setGrid] = useState(
    game.getState()
  );
  const [localSelectedSquare, setLocalSelectedSquare] = useState<number | null>(
    null
  );

  const handleSquareClick = (idx: number) => {
    if (currentPlayer !== WinStatus.PLAYER_X) return;
    if (selectedSquare !== null) return;
    setLocalSelectedSquare(idx);
  };

  const handleBoxClick = (ev: any, idx: number) => {
    if (currentPlayer !== WinStatus.PLAYER_X) return;
    if (selectedSquare !== null) {
      ev.stopPropagation();
      game.performMove(idx);

      setGrid(game.getState());
    }
    if (localSelectedSquare === null) return;

    const newState = game.performMove((localSelectedSquare + 1) * 10 + idx);
    setGrid(newState);
  };

  useEffect(() => {
    setLocalSelectedSquare(null);
  }, [selectedSquare]);

  useEffect(() => {
    if (currentPlayer === WinStatus.PLAYER_O) {
      const doThing = async () => {
        await game.getNextAiMove();
        setGrid(game.getState());
      };
      doThing();
    }
  }, [currentPlayer]);

  console.log({ selectedSquare, localSelectedSquare });
  return (
    <FullScreenContainer>
      <BoardWrapper>
        <TicTacContainer gap="64px">
          {grid.map((square, idx) => (
            <TicTacContainer
              isSelected={idx === selectedSquare || idx === localSelectedSquare}
              onClick={() => handleSquareClick(idx)}
            >
              {square.map((box, idx) => (
                <Square onClick={ev => handleBoxClick(ev, idx)} state={box} />
              ))}
            </TicTacContainer>
          ))}
        </TicTacContainer>
      </BoardWrapper>
    </FullScreenContainer>
  );
};
