import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [letter, setLetter] = useState("");
  const [gameState, setGameState] = useState({
    guessed_word: Array(6).fill("_"),
    attempts_left: 6,
    message: "",
  });

  const handleGuess = async () => {
    if (letter === "") {
      alert("Please enter a letter!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/guess", {
        letter,
      });
      setGameState(response.data);
      setLetter("");
    } catch (error) {
      console.error("Error making guess:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleGuess(); // Call the handleGuess function when Enter is pressed
    }
  };

  const renderHangman = () => {
    const stages = [
      "-----\n|   |\n|   O\n|  /|\\\n|  / \\\n|",
      "-----\n|   |\n|   O\n|  /|\\\n|  /\n|",
      "-----\n|   |\n|   O\n|  /|\n|\n|",
      "-----\n|   |\n|   O\n|   |\n|\n|",
      "-----\n|   |\n|   O\n|\n|\n|",
      "-----\n|   |\n|\n|\n|\n|",
      "-----\n|\n|\n|\n|\n|",
    ];
    return <pre>{stages[gameState.attempts_left]}</pre>;
  };

  const restartGame = async () => {
    setLetter("");
    try {
      const response = await axios.post("http://127.0.0.1:5000/reset");
      setGameState(response.data);
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="game-container">
        <h1>Hangman Game</h1>

        <div className="game-message">{gameState.message}</div>
        <div className="hangman-figure">{renderHangman()}</div>

        <div className="guessed-word">
          {gameState.guessed_word
            ? gameState.guessed_word.join(" ")
            : "Loading..."}
        </div>

        <div className="attempts-left">
          <strong>Attempts left:</strong> {gameState.attempts_left}
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <input
            type="text"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            onKeyDown={handleKeyDown} // Add keydown event listener
            maxLength="1"
            className="letter-input"
          />
          <button className="guess-button" onClick={handleGuess}>
            Guess
          </button>

          {gameState.message && (
            <button className="restart-button" onClick={restartGame}>
              Restart Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
