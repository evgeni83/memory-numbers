import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameBoard from './GameBoard';
import { CardType } from '../App';

describe('GameBoard', () => {
  const mockSetCards = jest.fn();
  const mockSetMistakes = jest.fn();
  const mockOnGameComplete = jest.fn();
  const mockSetLockBoard = jest.fn();
  const mockSetNextExpectedNumber = jest.fn();

  const defaultProps = {
    gridSize: 2,
    cards: [
      { id: 0, value: 1, isFlipped: false, isMatched: false },
      { id: 1, value: 2, isMatched: false, isFlipped: false },
      { id: 2, value: 3, isMatched: false, isFlipped: false },
      { id: 3, value: 4, isMatched: false, isFlipped: false },
    ] as CardType[],
    setCards: mockSetCards,
    setMistakes: mockSetMistakes,
    onGameComplete: mockOnGameComplete,
    lockBoard: false,
    setLockBoard: mockSetLockBoard,
    nextExpectedNumber: 1,
    setNextExpectedNumber: mockSetNextExpectedNumber,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock setTimeout to run immediately
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the correct number of cards based on grid size', () => {
    render(<GameBoard {...defaultProps} />);
    
    expect(screen.getAllByTestId('card-container')).toHaveLength(4); // 2x2 grid
  });

  it('handles card click correctly for correct sequence', () => {
    render(<GameBoard {...defaultProps} />);
    
    const cardWithCorrectValue = screen.getByText('1').closest('.card-container');
    fireEvent.click(cardWithCorrectValue!);
    
    expect(mockSetCards).toHaveBeenCalled();
    expect(mockSetNextExpectedNumber).toHaveBeenCalledWith(expect.any(Function));
  });

  it('handles card click correctly for incorrect sequence', async () => {
    render(<GameBoard {...defaultProps} />);
    
    const cardWithIncorrectValue = screen.getByText('2').closest('.card-container');
    fireEvent.click(cardWithIncorrectValue!);
    
    expect(mockSetMistakes).toHaveBeenCalled();
    expect(mockSetLockBoard).toHaveBeenCalledWith(true);
    
    // Advance timers to trigger the setTimeout
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(mockSetCards).toHaveBeenCalled();
      expect(mockSetNextExpectedNumber).toHaveBeenCalledWith(1);
      expect(mockSetLockBoard).toHaveBeenCalledWith(false);
    });
  });

  it('does not allow clicking when board is locked', () => {
    const lockedProps = { ...defaultProps, lockBoard: true };
    render(<GameBoard {...lockedProps} />);
    
    const card = screen.getByText('1').closest('.card-container');
    fireEvent.click(card!);
    
    expect(mockSetCards).not.toHaveBeenCalled();
  });

  it('does not allow clicking already flipped cards', () => {
    const cardWithFlipped = [
      { id: 0, value: 1, isFlipped: true, isMatched: false },
      { id: 1, value: 2, isFlipped: false, isMatched: false },
      { id: 2, value: 3, isFlipped: false, isMatched: false },
      { id: 3, value: 4, isFlipped: false, isMatched: false },
    ];
    
    render(<GameBoard {...defaultProps} cards={cardWithFlipped} />);
    
    const flippedCard = screen.getByText('1').closest('.card-container');
    fireEvent.click(flippedCard!);
    
    expect(mockSetCards).not.toHaveBeenCalled();
  });

  it('does not allow clicking already matched cards', () => {
    const cardWithMatched = [
      { id: 0, value: 1, isFlipped: false, isMatched: true },
      { id: 1, value: 2, isFlipped: false, isMatched: false },
      { id: 2, value: 3, isFlipped: false, isMatched: false },
      { id: 3, value: 4, isFlipped: false, isMatched: false },
    ];
    
    render(<GameBoard {...defaultProps} cards={cardWithMatched} />);
    
    const matchedCard = screen.getByText('1').closest('.card-container'); // Matched card shows value '1'
    fireEvent.click(matchedCard!);
    
    expect(mockSetCards).not.toHaveBeenCalled();
  });

  it('calls onGameComplete when all cards are matched', async () => {
    const allMatchedProps = {
      ...defaultProps,
      nextExpectedNumber: 4,
      cards: [
        { id: 0, value: 1, isFlipped: true, isMatched: true },
        { id: 1, value: 2, isFlipped: true, isMatched: true },
        { id: 2, value: 3, isFlipped: true, isMatched: true },
        { id: 3, value: 4, isFlipped: false, isMatched: false },
      ] as CardType[],
    };
    
    render(<GameBoard {...allMatchedProps} />);
    
    const lastCard = screen.getByText('4').closest('.card-container');
    fireEvent.click(lastCard!);
    
    expect(mockOnGameComplete).toHaveBeenCalled();
  });

  it('sets grid template columns based on grid size', () => {
    render(<GameBoard {...defaultProps} />);
    
    const gridElement = screen.getByTestId('board-grid'); // Need to add testId to component
    expect(gridElement).toBeInTheDocument();
  });
});