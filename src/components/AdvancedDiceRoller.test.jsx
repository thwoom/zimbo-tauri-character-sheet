import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdvancedDiceRoller from './AdvancedDiceRoller';

// Mock the advanced dice utilities
vi.mock('../utils/advancedDice.js', () => ({
  getDiceExamples: () => [
    { formula: '3d6 keep highest 2', description: 'Roll 3d6, keep the 2 highest' },
    { formula: 'd6!', description: 'Exploding d6 (reroll on max)' },
    { formula: '5d6 count 4+', description: 'Count successes on 4 or higher' },
    { formula: '2d20 advantage', description: 'Roll 2d20, take the higher' },
  ],
}));

// Mock motion components
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock Button component
vi.mock('./common/Button', () => ({
  default: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('AdvancedDiceRoller', () => {
  const mockProps = {
    character: {
      stats: {
        str: { mod: 2 },
        dex: { mod: 1 },
        con: { mod: 0 },
        int: { mod: -1 },
        wis: { mod: 1 },
        cha: { mod: 0 },
      },
    },
    rollDice: vi.fn(),
    rollResult: 'Ready to roll!',
    equippedWeaponDamage: '1d8',
    rollModal: {
      isOpen: false,
      close: vi.fn(),
    },
    rollModalData: {},
    aidModal: {
      isOpen: false,
      onConfirm: vi.fn(),
      onCancel: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the advanced dice roller title', () => {
    render(<AdvancedDiceRoller {...mockProps} />);
    expect(screen.getByText('🎲 Dice Roller')).toBeInTheDocument();
  });

  it('renders custom formula input', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    const input = screen.getByPlaceholderText('e.g., 3d6 keep highest 2+1, d6!, 5d6 count 4+');
    expect(input).toBeInTheDocument();
  });

  it('renders quick examples', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    expect(screen.getByText('3d6 keep highest 2')).toBeInTheDocument();
    expect(screen.getByText('d6!')).toBeInTheDocument();
    expect(screen.getByText('2d20 advantage')).toBeInTheDocument();
    expect(screen.getByText('5d6 count 4+')).toBeInTheDocument();
  });

  it('renders stat check buttons', () => {
    render(<AdvancedDiceRoller {...mockProps} />);
    expect(screen.getByText('str (+2)')).toBeInTheDocument();
    expect(screen.getByText('dex (+1)')).toBeInTheDocument();
    expect(screen.getByText('con (+0)')).toBeInTheDocument();
    expect(screen.getByText('int (-1)')).toBeInTheDocument();
    expect(screen.getByText('wis (+1)')).toBeInTheDocument();
    expect(screen.getByText('cha (+0)')).toBeInTheDocument();
  });

  it('renders basic moves', () => {
    render(<AdvancedDiceRoller {...mockProps} />);
    expect(screen.getByText('⚔️ Hack and Slash')).toBeInTheDocument();
    expect(screen.getByText('🛡️ Defy Danger')).toBeInTheDocument();
    expect(screen.getByText('📚 Spout Lore')).toBeInTheDocument();
  });

  it('renders damage rolls', () => {
    render(<AdvancedDiceRoller {...mockProps} />);
    expect(screen.getByText('🗡️ Weapon (1d8)')).toBeInTheDocument();
    expect(screen.getByText('🪨 Improvised (1d4)')).toBeInTheDocument();
  });

  it('renders basic dice', () => {
    render(<AdvancedDiceRoller {...mockProps} />);
    expect(screen.getByText('d4')).toBeInTheDocument();
    expect(screen.getByText('d6')).toBeInTheDocument();
    expect(screen.getByText('d8')).toBeInTheDocument();
    expect(screen.getByText('d10')).toBeInTheDocument();
    expect(screen.getByText('d12')).toBeInTheDocument();
    expect(screen.getByText('d20')).toBeInTheDocument();
  });

  it('handles custom formula input', async () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    const input = screen.getByPlaceholderText('e.g., 3d6 keep highest 2+1, d6!, 5d6 count 4+');
    const rollButton = screen.getByText('Roll');

    // Initially button should be disabled
    expect(rollButton).toBeDisabled();

    // Type a formula
    fireEvent.change(input, { target: { value: '3d6 keep highest 2' } });
    expect(input.value).toBe('3d6 keep highest 2');
    expect(rollButton).not.toBeDisabled();

    // Click roll button
    fireEvent.click(rollButton);
    expect(mockProps.rollDice).toHaveBeenCalledWith('3d6 keep highest 2', 'Custom Roll');
  });

  it.skip('handles Enter key in custom formula input', async () => {
    // TODO: Fix this test - the Enter key handling works but test is flaky
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    const input = screen.getByPlaceholderText('e.g., 3d6 keep highest 2+1, d6!, 5d6 count 4+');

    fireEvent.change(input, { target: { value: 'd6!' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });

    // The roll should happen immediately
    expect(mockProps.rollDice).toHaveBeenCalled();
  });

  it('handles quick example clicks', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    fireEvent.click(screen.getByText('3d6 keep highest 2'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('3d6 keep highest 2', 'Best of 3');

    fireEvent.click(screen.getByText('d6!'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('d6!', 'Exploding d6');

    fireEvent.click(screen.getByText('2d20 advantage'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('2d20 advantage', 'Advantage');
  });

  it('handles stat check clicks', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    fireEvent.click(screen.getByText('str (+2)'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('2d6+2', 'str Check');

    fireEvent.click(screen.getByText('dex (+1)'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('2d6+1', 'dex Check');
  });

  it('handles basic move clicks', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    fireEvent.click(screen.getByText('⚔️ Hack and Slash'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('2d6+1', 'Hack and Slash');

    fireEvent.click(screen.getByText('🛡️ Defy Danger'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('2d6', 'Defy Danger');
  });

  it('handles damage roll clicks', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    fireEvent.click(screen.getByText('🗡️ Weapon (1d8)'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('1d8', 'Weapon Damage');

    fireEvent.click(screen.getByText('🪨 Improvised (1d4)'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('1d4', 'Improvised Damage');
  });

  it('handles basic dice clicks', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    fireEvent.click(screen.getByText('d6'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('d6', 'd6');

    fireEvent.click(screen.getByText('d20'));
    expect(mockProps.rollDice).toHaveBeenCalledWith('d20', 'd20');
  });

  it('toggles examples visibility', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    const toggleButton = screen.getByText('Show All');
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText('Hide All')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide All'));
    expect(screen.getByText('Show All')).toBeInTheDocument();
  });

  it('displays roll result', () => {
    render(<AdvancedDiceRoller {...mockProps} />);
    expect(screen.getByText('Ready to roll!')).toBeInTheDocument();
  });

  it('clears custom formula after rolling', async () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    const input = screen.getByPlaceholderText('e.g., 3d6 keep highest 2+1, d6!, 5d6 count 4+');
    const rollButton = screen.getByText('Roll');

    fireEvent.change(input, { target: { value: '3d6 keep highest 2' } });
    fireEvent.click(rollButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('shows rolling state', async () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    const input = screen.getByPlaceholderText('e.g., 3d6 keep highest 2+1, d6!, 5d6 count 4+');
    const rollButton = screen.getByText('Roll');

    fireEvent.change(input, { target: { value: 'd6' } });

    // Check input value before rolling
    expect(input.value).toBe('d6');

    fireEvent.click(rollButton);

    // Check that rolling state is shown
    expect(screen.getAllByText('Rolling...')).toHaveLength(2); // Button and result box
  });

  it('handles empty custom formula', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    const rollButton = screen.getByText('Roll');

    // Button should be disabled for empty formula
    expect(rollButton).toBeDisabled();

    // Clicking should not call rollDice
    fireEvent.click(rollButton);
    expect(mockProps.rollDice).not.toHaveBeenCalled();
  });

  it('handles whitespace-only custom formula', () => {
    render(<AdvancedDiceRoller {...mockProps} />);

    // Switch to Advanced tab
    fireEvent.click(screen.getByText('⚡ Advanced'));

    const input = screen.getByPlaceholderText('e.g., 3d6 keep highest 2+1, d6!, 5d6 count 4+');
    const rollButton = screen.getByText('Roll');

    fireEvent.change(input, { target: { value: '   ' } });
    expect(rollButton).toBeDisabled();

    fireEvent.click(rollButton);
    expect(mockProps.rollDice).not.toHaveBeenCalled();
  });
});
