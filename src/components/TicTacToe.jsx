import React, { useState, useEffect } from "react";
import Board from "./Board";
import Reset from "./Reset";
import gameOverSoundAsset from "../sounds/game_over.wav";
import clickSoundAsset from "../sounds/click.wav";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  //Rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },

  //Columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },

  //Diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

function checkWinner(tiles, setStrikeClass, setGameState, setWinnerName, playerXName, playerOName) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      setStrikeClass(strikeClass);
      if (tileValue1 === PLAYER_X) {
        setGameState("X");
        setWinnerName(playerXName);
      } else {
        setGameState("O");
        setWinnerName(playerOName);
      }
      return;
    }
  }

  const areAllTilesFilledIn = tiles.every((tile) => tile !== null);
  if (areAllTilesFilledIn) {
    setGameState("Draw");
    setWinnerName("Draw");
  }
}

function TicTacToe() {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState("inProgress");
  const [playerXName, setPlayerXName] = useState("");
  const [playerOName, setPlayerOName] = useState("");
  const [namesConfirmed, setNamesConfirmed] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleTileClick = (index) => {
    if (gameState !== "inProgress" || tiles[index] !== null) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    setTiles(newTiles);
    setPlayerTurn(playerTurn === PLAYER_X ? PLAYER_O : PLAYER_X);
  };

  const handleReset = () => {
    if (playerXName && playerOName) {
      setGameState("inProgress");
      setTiles(Array(9).fill(null));
      setPlayerTurn(PLAYER_X);
      setStrikeClass(null);
      setWinnerName("");
      setShowPopup(false);
    }
  };

  const handleConfirmNames = () => {
    if (playerXName && playerOName) {
      setNamesConfirmed(true);
    }
  };

  const handlePlayerXNameChange = (e) => {
    let newName = e.target.value.slice(0, 10); // Batasi panjang nama maksimal 10 karakter
    newName = newName.charAt(0).toUpperCase() + newName.slice(1); // Jadikan huruf pertama besar
    setPlayerXName(newName.replace(/[^a-zA-Z]/g, "")); // Hapus karakter selain huruf
  };

  const handlePlayerONameChange = (e) => {
    let newName = e.target.value.slice(0, 10); // Batasi panjang nama maksimal 10 karakter
    newName = newName.charAt(0).toUpperCase() + newName.slice(1); // Jadikan huruf pertama besar
    setPlayerOName(newName.replace(/[^a-zA-Z]/g, "")); // Hapus karakter selain huruf
  };

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState, setWinnerName, playerXName, playerOName);
  }, [tiles, playerXName, playerOName]);

  useEffect(() => {
    if (gameState !== "inProgress") {
      gameOverSound.play();
      setShowPopup(true);
    }
  }, [gameState]);

  useEffect(() => {
    if (tiles.some((tile) => tile !== null)) {
      clickSound.play();
    }
  }, [tiles]); // Tambahkan dependency tiles di sini

  return (
    <div className="tiktak">
      {!namesConfirmed ? (
        <div className="names-container">
          <h1>Enter Player Names</h1>
          <h3>Noughts and Crosses</h3>
          <div className="player-input">
            <label htmlFor="playerXInput" className="input-label">
              Player X :
            </label>
            <input 
              id="playerXInput"
              type="text" 
              value={playerXName} 
              onChange={handlePlayerXNameChange} 
              className="input-field"
              placeholder="Enter Name for X Player"
              maxLength={10}
            />
          </div>
          <div className="player-input">
            <label htmlFor="playerOInput" className="input-label">
              Player O :
            </label>
            <input 
              id="playerOInput"
              type="text" 
              value={playerOName} 
              onChange={handlePlayerONameChange} 
              className="input-field"
              placeholder="Enter Name for O Player"
              maxLength={10}
            />
          </div>
          <button className="start-button" onClick={handleConfirmNames}>Start Game</button>
        </div>
      ) : (
        <>
          <h1>Noughts and Crosses</h1>
          <h2>{playerTurn === PLAYER_X ? playerXName : playerOName}'s Turn</h2>
          <Board
            playerTurn={playerTurn}
            tiles={tiles}
            onTileClick={handleTileClick}
            strikeClass={strikeClass}
          />
          <Reset gameState={gameState} onReset={handleReset} />
          {namesConfirmed && (
            <div className="change-names-container">
              <button
                className="change-names-button"
                onClick={() => setNamesConfirmed(false)}
              >
                Change Names
              </button>
            </div>
          )}
        </>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="popup-container">
          <div className="popup">
            <h2>{winnerName === "Draw" ? "It's a Draw!" : `${winnerName} Wins!`}</h2>
            <button className="popup-button" onClick={handleReset}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
