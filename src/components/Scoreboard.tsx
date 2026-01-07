import { type FC } from 'react';
import './Scoreboard.scss';

interface ScoreboardProps {
  mistakes: number;
  time: number;
}

const Scoreboard: FC<ScoreboardProps> = ({ mistakes, time }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="scoreboard">
      <p>Mistakes: {mistakes}</p>
      <p>Time: {formatTime(time)}</p>
    </div>
  );
};

export default Scoreboard;
