/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import useDiceRoller from '../hooks/useDiceRoller.js';
import DiceRoller from './DiceRoller.jsx';

const character = {
  stats: {
    STR: { mod: 0 },
    DEX: { mod: 0 },
    CON: { mod: 0 },
    INT: { mod: 0 },
    WIS: { mod: 0 },
    CHA: { mod: 0 },
  },
  statusEffects: [],
  debilities: [],
};

function Wrapper() {
  const { rollDice, rollResult, rollHistory } = useDiceRoller(character, () => {}, false);
  return (
    <DiceRoller
      character={character}
      rollDice={rollDice}
      rollResult={rollResult}
      rollHistory={rollHistory}
      getEquippedWeaponDamage={() => 'd4'}
      rollModal={{ isOpen: false, open: () => {}, close: () => {} }}
      rollModalData={{}}
    />
  );
}

describe('DiceRoller', () => {
  it('displays latest roll result after rolling', async () => {
    localStorage.clear();
    const user = userEvent.setup();
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<Wrapper />);
    await user.click(screen.getByText('d4'));
    randomSpy.mockRestore();
    expect(screen.getByText('d4: 1 = 1')).toBeInTheDocument();
  });
});
