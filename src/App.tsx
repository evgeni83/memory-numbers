import { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Scoreboard from './components/Scoreboard';
import GameOverModal from './components/GameOverModal';
import './App.scss';

export interface CardType {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

function App() {
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

  const [gridSize, setGridSize] = useState<number>(2);
  const [cards, setCards] = useState<CardType[]>(generateCards(2));
  const [mistakes, setMistakes] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [lockBoard, setLockBoard] = useState<boolean>(false);
  const [nextExpectedNumber, setNextExpectedNumber] = useState<number>(1);

  const handleNewGame = (newGridSize: number) => {
    setGridSize(newGridSize);
    setCards(generateCards(newGridSize));
    setMistakes(0);
    setTime(0);
    setIsGameOver(false);
    setNextExpectedNumber(1);
    setLockBoard(false);
  };

  useEffect(() => {
    let timer: number | null = null;
    if (!isGameOver) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGameOver]);

  const handleGameCompletion = () => {
    setIsGameOver(true);
  };

  const handleNextLevel = () => {
    handleNewGame(gridSize + 1);
  };


  return (
    <div className="app-container">
      <h1>Game: Open Numbers in Order</h1>
      <>
        <Scoreboard mistakes={mistakes} time={time} />
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
      <GameOverModal
        isVisible={isGameOver}
        time={time}
        mistakes={mistakes}
        onRestart={handleNextLevel}
      />
    </div>
  );
}

export default App;
