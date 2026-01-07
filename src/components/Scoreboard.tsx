import { type FC } from 'react';
import './Scoreboard.scss';

interface ScoreboardProps {
  mistakes: number;
  time: number;
  highScore: { time: number; mistakes: number } | null;
}

const Scoreboard: FC<ScoreboardProps> = ({ mistakes, time, highScore }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="scoreboard">
      <p>mistakes: {mistakes}</p>
      <p>Time: {formatTime(time)}</p>
      {highScore && (
        <p>High Score: {formatTime(highScore.time)} ({highScore.mistakes} mistakes)</p>
      )}
    </div>
  );
};

export default Scoreboard;
