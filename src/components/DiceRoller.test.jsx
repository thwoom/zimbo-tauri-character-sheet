/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import DiceRoller from './DiceRoller.jsx';

const minimalCharacter = {
  stats: {
    STR: { score: 10, mod: 1 },
    DEX: { score: 10, mod: 0 },
  },
};

const rollHistory = [{ timestamp: 1697040000000, result: '2d6: 7 = 7' }];

describe('DiceRoller', () => {
  it('calls rollDice when buttons clicked', async () => {
    const user = userEvent.setup();
    const rollDice = vi.fn();
    render(
      <DiceRoller
        character={minimalCharacter}
        rollDice={rollDice}
        equippedWeaponDamage="d8"
        rollResult="d20: 9 = 9"
        rollHistory={rollHistory}
        rollModal={{ isOpen: false, close: vi.fn() }}
        rollModalData={{}}
        aidModal={{ isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() }}
      />,
    );

    await user.click(screen.getByText('STR (+1)'));
    expect(rollDice).toHaveBeenCalledWith('2d6+1', 'STR Check');

    await user.click(screen.getByText('d6'));
    expect(rollDice).toHaveBeenCalledWith('d6', undefined);

    await user.click(screen.getByText('Aid/Interfere'));
    expect(rollDice).toHaveBeenCalledWith('2d6', 'Aid/Interfere');
  });

  it('shows roll result and history', () => {
    const rollDice = vi.fn();
    render(
      <DiceRoller
        character={minimalCharacter}
        rollDice={rollDice}
        equippedWeaponDamage="d8"
        rollResult="d20: 9 = 9"
        rollHistory={rollHistory}
        rollModal={{ isOpen: false, close: vi.fn() }}
        rollModalData={{}}
        aidModal={{ isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() }}
      />,
    );
    expect(screen.getByText('d20: 9 = 9')).toBeInTheDocument();
    expect(screen.getByText('Recent Rolls:')).toBeInTheDocument();
    expect(screen.getByText(/2d6: 7 = 7/)).toBeInTheDocument();
  });

  it('updates displayed roll result when prop changes', () => {
    const rollDice = vi.fn();
    const { rerender } = render(
      <DiceRoller
        character={minimalCharacter}
        rollDice={rollDice}
        equippedWeaponDamage="d8"
        rollResult="d20: 9 = 9"
        rollHistory={rollHistory}
        rollModal={{ isOpen: false, close: vi.fn() }}
        rollModalData={{}}
        aidModal={{ isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() }}
      />,
    );
    expect(screen.getByText('d20: 9 = 9')).toBeInTheDocument();
    rerender(
      <DiceRoller
        character={minimalCharacter}
        rollDice={rollDice}
        equippedWeaponDamage="d8"
        rollResult="d20: 10 = 10"
        rollHistory={rollHistory}
        rollModal={{ isOpen: false, close: vi.fn() }}
        rollModalData={{}}
        aidModal={{ isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() }}
      />,
    );
    expect(screen.getByText('d20: 10 = 10')).toBeInTheDocument();
  });

  it('shows rolling state before displaying result', async () => {
    const user = userEvent.setup();
    const rollDice = vi.fn();
    const { rerender } = render(
      <DiceRoller
        character={minimalCharacter}
        rollDice={rollDice}
        equippedWeaponDamage="d8"
        rollResult=""
        rollHistory={rollHistory}
        rollModal={{ isOpen: false, close: vi.fn() }}
        rollModalData={{}}
        aidModal={{ isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() }}
      />,
    );

    await user.click(screen.getByText('d6'));

    rerender(
      <DiceRoller
        character={minimalCharacter}
        rollDice={rollDice}
        equippedWeaponDamage="d8"
        rollResult="d6: 4 = 4"
        rollHistory={rollHistory}
        rollModal={{ isOpen: false, close: vi.fn() }}
        rollModalData={{}}
        aidModal={{ isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() }}
      />,
    );

    expect(screen.getByText(/rolling/i)).toBeInTheDocument();
    await screen.findByText('d6: 4 = 4');
    expect(screen.queryByText(/rolling/i)).not.toBeInTheDocument();
  });
});
