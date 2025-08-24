import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RollHistory from './RollHistory';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  },
  AnimatePresence: ({ children }) => children,
}));

describe('RollHistory', () => {
  const mockRollHistory = [
    {
      timestamp: Date.now(),
      description: 'Strength Check',
      result: '2d6+2: 4 + 3 + 2 = 9',
      total: 9,
    },
    {
      timestamp: Date.now() + 1000,
      description: 'Hack and Slash',
      result: '2d6+1: 6 + 2 + 1 = 9',
      total: 9,
    },
    {
      timestamp: Date.now() + 2000,
      description: 'Spout Lore',
      result: '2d6+1: 6 + 6 + 1 = 13',
      total: 13,
    },
  ];

  it('renders nothing when rollHistory is empty', () => {
    const { container } = render(<RollHistory rollHistory={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders roll history when rolls exist', () => {
    render(<RollHistory rollHistory={mockRollHistory} />);
    
    expect(screen.getByText('🎲 Recent Rolls')).toBeInTheDocument();
    expect(screen.getByText('Strength Check')).toBeInTheDocument();
    expect(screen.getByText('Hack and Slash')).toBeInTheDocument();
    expect(screen.getByText('Spout Lore')).toBeInTheDocument();
  });

  it('displays roll results correctly', () => {
    render(<RollHistory rollHistory={mockRollHistory} />);
    
    expect(screen.getByText('2d6+2: 4 + 3 + 2 = 9')).toBeInTheDocument();
    expect(screen.getByText('2d6+1: 6 + 2 + 1 = 9')).toBeInTheDocument();
    expect(screen.getByText('2d6+1: 6 + 6 + 1 = 13')).toBeInTheDocument();
  });

  it('displays roll totals correctly', () => {
    render(<RollHistory rollHistory={mockRollHistory} />);
    
    const totals = screen.getAllByText('9');
    expect(totals).toHaveLength(2); // Two rolls with total 9
    expect(screen.getByText('13')).toBeInTheDocument();
  });

  it('applies correct CSS classes for roll results', () => {
    const diverseRolls = [
      { timestamp: 1, description: 'Fail', result: '2d6: 2 + 2 = 4', total: 4 },
      { timestamp: 2, description: 'Partial', result: '2d6: 3 + 4 = 7', total: 7 },
      { timestamp: 3, description: 'Success', result: '2d6: 6 + 5 = 11', total: 11 },
    ];

    const { container } = render(<RollHistory rollHistory={diverseRolls} />);
    
    // Check that different CSS classes are applied
    const historyItems = container.querySelectorAll('[class*="historyItem"]');
    expect(historyItems).toHaveLength(3);
  });

  it('shows most recent rolls first (reversed order)', () => {
    render(<RollHistory rollHistory={mockRollHistory} />);
    
    const rollLabels = screen.getAllByText(/Check|Slash|Lore/);
    // Should be in reverse order (most recent first)
    expect(rollLabels[0]).toHaveTextContent('Spout Lore');
    expect(rollLabels[1]).toHaveTextContent('Hack and Slash');
    expect(rollLabels[2]).toHaveTextContent('Strength Check');
  });

  it('limits display to 5 most recent rolls', () => {
    const manyRolls = Array.from({ length: 10 }, (_, i) => ({
      timestamp: Date.now() + i * 1000,
      description: `Roll ${i + 1}`,
      result: `2d6: ${i + 1}`,
      total: i + 1,
    }));

    render(<RollHistory rollHistory={manyRolls} />);
    
    // Should only show 5 rolls
    const rollLabels = screen.getAllByText(/Roll \d+/);
    expect(rollLabels).toHaveLength(5);
    
    // Should show the 5 most recent (6-10)
    expect(screen.getByText('Roll 10')).toBeInTheDocument();
    expect(screen.getByText('Roll 6')).toBeInTheDocument();
    expect(screen.queryByText('Roll 5')).not.toBeInTheDocument();
  });
});
