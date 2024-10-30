import React from "react";
import GameState from "./GameState";

function GameOver({ gameState, playerXName, playerOName }) {
  switch (gameState) {
    case GameState.inProgress:
      return <></>;
    case GameState.playerOWins:
      return <div className="game-over">{playerOName} Wins</div>;
    case GameState.playerXWins:
      return <div className="game-over">{playerXName} Wins</div>;
    case GameState.draw:
      return <div className="game-over">Draw</div>;
    default:
      return <></>;
  }
}

export default GameOver;
