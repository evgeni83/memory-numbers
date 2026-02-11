import { render, screen } from '@testing-library/react';
import Scoreboard from './Scoreboard';

describe('Scoreboard', () => {
  it('renders mistakes and time correctly', () => {
    render(<Scoreboard mistakes={3} time={125} />);
    
    expect(screen.getByText(/Mistakes: 3/)).toBeInTheDocument();
    expect(screen.getByText(/Time: 02:05/)).toBeInTheDocument(); // 125 seconds = 2 min 5 sec
  });

  it('formats time correctly for less than a minute', () => {
    render(<Scoreboard mistakes={0} time={45} />);
    
    expect(screen.getByText(/Time: 00:45/)).toBeInTheDocument();
  });

  it('formats time correctly for multiple minutes', () => {
    render(<Scoreboard mistakes={1} time={3661} />); // 1 hour, 1 minute, 1 second
    
    expect(screen.getByText(/Time: 61:01/)).toBeInTheDocument();
  });
});