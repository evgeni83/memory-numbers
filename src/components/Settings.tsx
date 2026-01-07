import { type FC, useState } from 'react';
import './Settings.scss';

interface SettingsProps {
  onNewGame: (gridSize: number) => void;
}

const Settings: FC<SettingsProps> = ({ onNewGame }) => {
  const [selectedGridSize, setSelectedGridSize] = useState<number>(3);

  const handleStartGame = () => {
    onNewGame(selectedGridSize);
  };

  return (
    <div className="settings">
      <label htmlFor="grid-size-select">Select Grid Size:</label>
      <select
        id="grid-size-select"
        value={selectedGridSize}
        onChange={(e) => setSelectedGridSize(Number(e.target.value))}
      >
        <option value={3}>3x3</option>
        <option value={4}>4x4</option>
        <option value={5}>5x5</option>
      </select>
      <button onClick={handleStartGame}>New Game</button>
    </div>
  );
};

export default Settings;
