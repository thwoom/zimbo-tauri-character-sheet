import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import FloatingDiceButton from './FloatingDiceButton';

describe('FloatingDiceButton', () => {
  it('renders with dice icon', () => {
    const mockOnClick = vi.fn();
    render(<FloatingDiceButton onClick={mockOnClick} isOpen={false} />);

    expect(screen.getByRole('button', { name: 'Open dice roller' })).toBeInTheDocument();
    expect(screen.getByText('🎲')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<FloatingDiceButton onClick={mockOnClick} isOpen={false} />);

    const button = screen.getByRole('button', { name: 'Open dice roller' });
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies active class when isOpen is true', () => {
    const mockOnClick = vi.fn();
    render(<FloatingDiceButton onClick={mockOnClick} isOpen={true} />);

    const button = screen.getByRole('button', { name: 'Open dice roller' });
    expect(button.className).toContain('active');
  });

  it('has correct accessibility attributes', () => {
    const mockOnClick = vi.fn();
    render(<FloatingDiceButton onClick={mockOnClick} isOpen={false} />);

    const button = screen.getByRole('button', { name: 'Open dice roller' });
    expect(button).toHaveAttribute('aria-label', 'Open dice roller');
    expect(button).toHaveAttribute('title', 'Dice Roller');
  });
});
