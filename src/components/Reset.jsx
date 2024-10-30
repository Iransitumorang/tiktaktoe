import GameState from "./GameState";

function Reset({ gameState, onReset }) {
  return (
    <button
      onClick={onReset}
      className={`reset-button ${gameState !== GameState.inProgress ? 'show' : ''}`}
    >
      {gameState !== GameState.inProgress ? "Reset Game" : null}
    </button>
  );
}

export default Reset;
