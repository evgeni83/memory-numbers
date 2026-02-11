import { render, screen, fireEvent } from '@testing-library/react';
import GameOverModal from './GameOverModal';

describe('GameOverModal', () => {
  const mockOnRestart = jest.fn();

  beforeEach(() => {
    mockOnRestart.mockClear();
  });

  it('does not render when isVisible is false', () => {
    render(
      <GameOverModal 
        isVisible={false} 
        time={120} 
        mistakes={2} 
        onRestart={mockOnRestart} 
      />
    );
    
    expect(screen.queryByText(/Game Over!/)).not.toBeInTheDocument();
  });

  it('renders when isVisible is true', () => {
    render(
      <GameOverModal 
        isVisible={true} 
        time={120} 
        mistakes={2} 
        onRestart={mockOnRestart} 
      />
    );
    
    expect(screen.getByText(/Game Over!/)).toBeInTheDocument();
    expect(screen.getByText(/Your Time: 02:00/)).toBeInTheDocument();
    expect(screen.getByText(/Your Mistakes: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Next Level/)).toBeInTheDocument();
  });

  it('calls onRestart when button is clicked', () => {
    render(
      <GameOverModal 
        isVisible={true} 
        time={120} 
        mistakes={2} 
        onRestart={mockOnRestart} 
      />
    );
    
    fireEvent.click(screen.getByText(/Next Level/));
    expect(mockOnRestart).toHaveBeenCalledTimes(1);
  });

  it('formats time correctly', () => {
    render(
      <GameOverModal 
        isVisible={true} 
        time={3661} // 61 min 1 sec
        mistakes={0} 
        onRestart={mockOnRestart} 
      />
    );
    
    expect(screen.getByText(/Your Time: 61:01/)).toBeInTheDocument();
  });
});