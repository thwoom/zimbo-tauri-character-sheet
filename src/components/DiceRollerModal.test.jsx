import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DiceRollerModal from './DiceRollerModal';

// Mock the child components
vi.mock('./RollModal', () => ({
  default: ({ isOpen }) => (isOpen ? <div data-testid="roll-modal">Roll Modal</div> : null),
}));

vi.mock('./AidInterfereModal', () => ({
  default: ({ isOpen }) => (isOpen ? <div data-testid="aid-modal">Aid Modal</div> : null),
}));

describe('DiceRollerModal', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      isOpen: true,
      onClose: vi.fn(),
      character: {
        stats: {
          STR: { mod: 1 },
          DEX: { mod: 2 },
          CON: { mod: 0 },
        },
      },
      rollDice: vi.fn(),
      rollResult: 'Roll result: 12',
      rollHistory: [{ timestamp: Date.now(), result: 'Previous roll: 10' }],
      equippedWeaponDamage: 'd8',
      rollModal: { isOpen: false, close: vi.fn() },
      rollModalData: {},
      aidModal: { isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() },
    };
  });

  it('renders when isOpen is true', () => {
    render(<DiceRollerModal {...mockProps} />);

    expect(screen.getByText('🎲 Dice Roller')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close dice roller' })).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<DiceRollerModal {...mockProps} isOpen={false} />);

    expect(screen.queryByText('🎲 Dice Roller')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<DiceRollerModal {...mockProps} />);

    const closeButton = screen.getByRole('button', { name: 'Close dice roller' });
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    render(<DiceRollerModal {...mockProps} />);

    const overlay = screen.getByRole('presentation');
    fireEvent.click(overlay);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<DiceRollerModal {...mockProps} />);

    const modal = screen.getByRole('dialog');
    fireEvent.click(modal);

    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  it('displays stat check buttons', () => {
    render(<DiceRollerModal {...mockProps} />);

    expect(screen.getByRole('button', { name: 'Roll STR Check' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Roll DEX Check' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Roll CON Check' })).toBeInTheDocument();
  });

  it('displays roll result', () => {
    render(<DiceRollerModal {...mockProps} />);

    expect(screen.getByText('Roll result: 12')).toBeInTheDocument();
  });

  it('displays roll history', () => {
    render(<DiceRollerModal {...mockProps} />);

    expect(screen.getByText('Recent Rolls:')).toBeInTheDocument();
    expect(screen.getByText(/Previous roll: 10/)).toBeInTheDocument();
  });

  it('uses STR modifier for Hack & Slash roll', () => {
    render(<DiceRollerModal {...mockProps} />);

    const hackButton = screen.getByRole('button', { name: 'Roll Hack & Slash' });
    fireEvent.click(hackButton);

    expect(mockProps.rollDice).toHaveBeenCalledWith('2d6+1', 'Hack & Slash');
  });

  it('updates Hack & Slash modifier when STR mod changes', () => {
    const { rerender } = render(<DiceRollerModal {...mockProps} />);

    expect(screen.getByText(/Hack & Slash/)).toHaveTextContent('Hack & Slash (+1)');

    rerender(
      <DiceRollerModal
        {...mockProps}
        character={{
          ...mockProps.character,
          stats: { ...mockProps.character.stats, STR: { mod: 2 } },
        }}
      />,
    );

    expect(screen.getByText(/Hack & Slash/)).toHaveTextContent('Hack & Slash (+2)');
  });
});
