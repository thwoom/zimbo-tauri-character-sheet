/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import InventoryPanel from './InventoryPanel.jsx';

describe('InventoryPanel', () => {
  it('uses consumable items and calls handlers', async () => {
    const user = userEvent.setup();
    const setCharacter = vi.fn();
    const setRollResult = vi.fn();
    const rollDie = vi.fn(() => 4);
    const character = {
      inventory: [{ id: 1, name: 'Healing Potion', type: 'consumable', quantity: 1 }],
      debilities: [],
    };
    render(
      <InventoryPanel
        character={character}
        setCharacter={setCharacter}
        rollDie={rollDie}
        setRollResult={setRollResult}
      />,
    );
    const useBtn = screen.getByText('Use');
    await user.click(useBtn);
    expect(rollDie).toHaveBeenCalledWith(8);
    expect(setCharacter).toHaveBeenCalled();
    expect(setRollResult).toHaveBeenCalledWith(expect.stringContaining('Used Healing Potion'));
  });

  it('shows debilities section when character has debilities', () => {
    const character = { inventory: [], debilities: ['weak'] };
    render(
      <InventoryPanel
        character={character}
        setCharacter={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
      />,
    );
    expect(screen.getByText(/Active Debilities:/i)).toBeInTheDocument();
    expect(screen.getByText(/Weak/)).toBeInTheDocument();
  });
});
