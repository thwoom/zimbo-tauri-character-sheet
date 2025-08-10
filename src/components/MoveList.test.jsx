/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import MoveList from './MoveList.jsx';

const minimalCharacter = {
  stats: {
    STR: { score: 10, mod: 1 },
    DEX: { score: 10, mod: 0 },
  },
};

const rollHistory = [{ timestamp: '10:00', result: '2d6: 7' }];

describe('MoveList', () => {
  it('calls rollDice for stat checks and basic dice', async () => {
    const user = userEvent.setup();
    const rollDice = vi.fn();
    render(
      <MoveList
        character={minimalCharacter}
        rollDice={rollDice}
        getEquippedWeaponDamage={() => 'd8'}
        rollResult="Result: 9"
        rollHistory={rollHistory}
      />,
    );

    await user.click(screen.getByText('STR (+1)'));
    expect(rollDice).toHaveBeenCalledWith('2d6+1', 'STR Check');

    await user.click(screen.getByText('d6'));
    expect(rollDice).toHaveBeenCalledWith('d6');
  });

  it('shows roll result and history', () => {
    const rollDice = vi.fn();
    render(
      <MoveList
        character={minimalCharacter}
        rollDice={rollDice}
        getEquippedWeaponDamage={() => 'd8'}
        rollResult="Result: 9"
        rollHistory={rollHistory}
      />,
    );
    expect(screen.getByText('Result: 9')).toBeInTheDocument();
    expect(screen.getByText('Recent Rolls:')).toBeInTheDocument();
    expect(screen.getByText(/2d6: 7/)).toBeInTheDocument();
  });
});
