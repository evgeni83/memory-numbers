import { type Dispatch, type FC, type SetStateAction, useState } from 'react';
import Card from './Card';
import './GameBoard.scss';
import type { CardType } from '../App';

interface GameBoardProps {
  gridSize: number;
  cards: CardType[];
  setCards: Dispatch<SetStateAction<CardType[]>>;
  setMistakes: Dispatch<SetStateAction<number>>;
  onGameComplete: () => void;
  lockBoard: boolean;
  setLockBoard: Dispatch<SetStateAction<boolean>>;
  nextExpectedNumber: number;
  setNextExpectedNumber: Dispatch<SetStateAction<number>>;
}

const GameBoard: FC<GameBoardProps> = ({
  gridSize,
  cards,
  setCards,
  setMistakes,
  onGameComplete,
  lockBoard,
  setLockBoard,
  nextExpectedNumber,
  setNextExpectedNumber,
}) => {
  const [wrongGuessId, setWrongGuessId] = useState<number | null>(null);

  const handleCardClick = (clickedCard: CardType) => {
    if (lockBoard || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    if (clickedCard.value === nextExpectedNumber) {
      setNextExpectedNumber((prev) => prev + 1);
      const updatedCards = newCards.map((card) =>
        card.id === clickedCard.id ? { ...card, isMatched: true } : card
      );
      setCards(updatedCards);

      const totalCards = gridSize * gridSize;
      if (nextExpectedNumber === totalCards) {
        onGameComplete();
      }
    } else {
      setMistakes((prevMistakes) => prevMistakes + 1);
      setLockBoard(true);
      setWrongGuessId(clickedCard.id);
      setTimeout(() => {
        const resetCards = newCards.map((card) => (
          { ...card, isFlipped: false, isMatched: false }
        ));
        setCards(resetCards);
        setWrongGuessId(null);
        setNextExpectedNumber(1);
        setLockBoard(false);
      }, 1000);
    }
  };

  return (
    <div
      className="board-grid"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          isWrong={wrongGuessId === card.id}
          onClick={() => handleCardClick(card)}
        />
      ))}
    </div>
  );
};

export default GameBoard;
