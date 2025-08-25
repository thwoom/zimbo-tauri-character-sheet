/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import DiceRoller from './DiceRoller';

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
        setCharacter={vi.fn()}
        saveToHistory={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Roll STR Check' }));
    expect(rollDice).toHaveBeenCalledWith('2d6+1', 'STR Check');

    await user.click(screen.getByRole('button', { name: 'Roll d6' }));
    expect(rollDice).toHaveBeenCalledWith('d6');

    await user.click(screen.getByRole('button', { name: 'Roll Aid or Interfere' }));
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
        setCharacter={vi.fn()}
        saveToHistory={vi.fn()}
      />,
    );
    expect(screen.getByText('d20: 9 = 9')).toBeInTheDocument();
    expect(screen.getByText('Recent Rolls:')).toBeInTheDocument();
    expect(screen.getByText(/2d6: 7 = 7/)).toBeInTheDocument();
  });

  it('announces results politely', () => {
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
        setCharacter={vi.fn()}
        saveToHistory={vi.fn()}
      />,
    );
    expect(screen.getByText('d20: 9 = 9')).toHaveAttribute('aria-live', 'polite');
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
        setCharacter={vi.fn()}
        saveToHistory={vi.fn()}
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
        setCharacter={vi.fn()}
        saveToHistory={vi.fn()}
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
        setCharacter={vi.fn()}
        saveToHistory={vi.fn()}
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
        setCharacter={vi.fn()}
        saveToHistory={vi.fn()}
      />,
    );

    expect(screen.getByText(/rolling/i)).toBeInTheDocument();
    await screen.findByText('d6: 4 = 4');
    expect(screen.queryByText(/rolling/i)).not.toBeInTheDocument();
  });

  it('adds, persists, and uses roll presets', async () => {
    const user = userEvent.setup();
    const rollDice = vi.fn();
    // Start with saved presets empty
    render(
      <DiceRoller
        character={minimalCharacter}
        rollDice={rollDice}
        equippedWeaponDamage="d8"
        rollResult=""
        rollHistory={[]}
        rollModal={{ isOpen: false, close: vi.fn() }}
        rollModalData={{}}
        aidModal={{ isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() }}
        setCharacter={vi.fn()}
        saveToHistory={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/preset name/i), 'Volley');
    await user.type(screen.getByLabelText(/preset formula/i), '2d6+1');
    await user.click(screen.getByRole('button', { name: /add preset/i }));

    // Use preset
    await user.click(screen.getByRole('button', { name: /roll preset volley/i }));
    expect(rollDice).toHaveBeenCalledWith('2d6+1', 'Volley');
  });

  it('provides ammo spend callback for volley', async () => {
    const user = userEvent.setup();
    const rollDice = vi.fn();
    const setCharacter = vi.fn();
    render(
      <DiceRoller
        character={minimalCharacter}
        rollDice={rollDice}
        equippedWeaponDamage="d8"
        rollResult=""
        rollHistory={[]}
        rollModal={{ isOpen: false, close: vi.fn() }}
        rollModalData={{}}
        aidModal={{ isOpen: false, onConfirm: vi.fn(), onCancel: vi.fn() }}
        setCharacter={setCharacter}
        saveToHistory={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Roll Volley' }));
    const volleyCall = rollDice.mock.calls.find((c) => c[1] === 'Volley');
    expect(volleyCall[0]).toBe('2d6+0');
    expect(typeof volleyCall[2].onSpendAmmo).toBe('function');
    volleyCall[2].onSpendAmmo();
    const updateFn = setCharacter.mock.calls[0][0];
    const newState = updateFn({ resources: { ammo: 2 } });
    expect(newState.resources.ammo).toBe(1);
  });
});
