import { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Scoreboard from './components/Scoreboard';
import Settings from './components/Settings';
import GameOverModal from './components/GameOverModal';
import './App.scss';

export interface CardType {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface HighScore {
  time: number;
  mistakes: number;
}

function App() {
  const [gridSize, setGridSize] = useState<number>(3);
  const [cards, setCards] = useState<CardType[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [lockBoard, setLockBoard] = useState<boolean>(false);
  const [nextExpectedNumber, setNextExpectedNumber] = useState<number>(1);

  const [highScore, setHighScore] = useState<HighScore | null>(() => {
    const savedHighScore = localStorage.getItem('highScore');
    return savedHighScore ? JSON.parse(savedHighScore) : null;
  });

  useEffect(() => {
    let timer: number | null = null;
    if (isGameActive && !isGameOver) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGameActive, isGameOver]);

  const saveHighScore = (newScore: HighScore) => {
    localStorage.setItem('highScore', JSON.stringify(newScore));
    setHighScore(newScore);
    setIsNewHighScore(true);
  };

  const generateCards = useCallback((size: number) => {
    const totalCards = size * size;
    const numbers = Array.from({ length: totalCards }, (_, i) => i + 1);

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers.map((number, index) => ({
      id: index,
      value: number,
      isFlipped: false,
      isMatched: false,
    }));
  }, []);

  const handleNewGame = (newGridSize: number) => {
    setGridSize(newGridSize);
    setCards(generateCards(newGridSize));
    setMistakes(0);
    setTime(0);
    setIsGameOver(false);
    setIsGameActive(true);
    setIsNewHighScore(false);
    setNextExpectedNumber(1);
    setLockBoard(false);
  };

  const handleGameCompletion = () => {
    setIsGameActive(false);
    setIsGameOver(true);

    if (!highScore || time < highScore.time || (time === highScore.time && mistakes < highScore.mistakes)) {
      saveHighScore({ time, mistakes: mistakes });
    }
  };

  const handleRestart = () => {
    handleNewGame(gridSize);
  };


  return (
    <div className="app-container">
      <h1>Memory Numbers Game</h1>
      <Settings onNewGame={handleNewGame} />
      {isGameActive || isGameOver ? (
        <>
          <Scoreboard mistakes={mistakes} time={time} highScore={highScore} />
          <GameBoard
            gridSize={gridSize}
            cards={cards}
            setCards={setCards}
            setMistakes={setMistakes}
            onGameComplete={handleGameCompletion}
            lockBoard={lockBoard}
            setLockBoard={setLockBoard}
            nextExpectedNumber={nextExpectedNumber}
            setNextExpectedNumber={setNextExpectedNumber}
          />
        </>
      ) : (
        <p className='start-game-helper'>Select a grid size and click "New Game" to start!</p>
      )}
      <GameOverModal
        isVisible={isGameOver}
        time={time}
        mistakes={mistakes}
        isNewHighScore={isNewHighScore}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default App;
