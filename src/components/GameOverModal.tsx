import { type FC } from 'react';
import './GameOverModal.scss';

interface GameOverModalProps {
  isVisible: boolean;
  time: number;
  mistakes: number;
  onRestart: () => void;
}

const GameOverModal: FC<GameOverModalProps> = ({
  isVisible,
  time,
  mistakes,
  onRestart,
}) => {
  if (!isVisible) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game Over!</h2>
        <p>Your Time: {formatTime(time)}</p>
        <p>Your Mistakes: {mistakes}</p>
        <button onClick={onRestart}>Next Level</button>
      </div>
    </div>
  );
};

export default GameOverModal;
