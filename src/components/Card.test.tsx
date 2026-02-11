import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
import type { CardType } from '../App';

describe('Card', () => {
  const mockOnClick = jest.fn();
  const defaultProps: CardType = {
    id: 1,
    value: 5,
    isFlipped: false,
    isMatched: false,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders correctly when not flipped', () => {
    render(
      <Card 
        card={defaultProps} 
        isWrong={false} 
        onClick={mockOnClick} 
      />
    );

    // Both faces are present in the DOM, but the back face should be visible by default
    expect(screen.getByText('?')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows value when card is flipped', () => {
    const flippedCard = { ...defaultProps, isFlipped: true };
    
    render(
      <Card 
        card={flippedCard} 
        isWrong={false} 
        onClick={mockOnClick} 
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('applies matched class when card is matched', () => {
    const matchedCard = { ...defaultProps, isMatched: true };
    
    render(
      <Card 
        card={matchedCard} 
        isWrong={false} 
        onClick={mockOnClick} 
      />
    );

    const cardElement = screen.getByText('?').closest('.card');
    expect(cardElement).toHaveClass('is-matched');
  });

  it('applies wrong class when isWrong prop is true', () => {
    render(
      <Card 
        card={defaultProps} 
        isWrong={true} 
        onClick={mockOnClick} 
      />
    );

    const cardElement = screen.getByText('?').closest('.card');
    expect(cardElement).toHaveClass('is-wrong');
  });

  it('calls onClick when clicked', () => {
    render(
      <Card 
        card={defaultProps} 
        isWrong={false} 
        onClick={mockOnClick} 
      />
    );

    fireEvent.click(screen.getByText('?'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies flipped class when card is flipped', () => {
    const flippedCard = { ...defaultProps, isFlipped: true };
    
    render(
      <Card 
        card={flippedCard} 
        isWrong={false} 
        onClick={mockOnClick} 
      />
    );

    const cardElement = screen.getByText('5').closest('.card');
    expect(cardElement).toHaveClass('is-flipped');
  });
});