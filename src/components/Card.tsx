import type { FC } from 'react';
import './Card.scss';
import { type CardType } from '../App';

interface CardProps {
  card: CardType;
  isWrong: boolean;
  onClick: () => void;
}

const Card: FC<CardProps> = ({ card, isWrong, onClick }) => {
  const { value, isFlipped, isMatched } = card;

  const cardClasses = [
    'card',
    isFlipped ? 'is-flipped' : '',
    isMatched ? 'is-matched' : '',
    isWrong ? 'is-wrong' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="card-container" onClick={onClick}>
      <div className={cardClasses}>
        <div className="card-face card-face-front">
          {value}
        </div>
        <div className="card-face card-face-back">
          ?
        </div>
      </div>
    </div>
  );
};

export default Card;
