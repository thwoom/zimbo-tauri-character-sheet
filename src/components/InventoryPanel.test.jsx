import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import InventoryPanel from './InventoryPanel.jsx';

const characterTemplate = {
  inventory: [],
  baseLoad: 0,
  stats: { STR: { mod: 0 } },
};

function setup(custom = {}) {
  const setCharacter = vi.fn();
  const saveToHistory = vi.fn();
  const setShowAddItemModal = vi.fn();
  const character = { ...characterTemplate, ...custom };
  render(
    <InventoryPanel
      character={character}
      setCharacter={setCharacter}
      saveToHistory={saveToHistory}
      setShowAddItemModal={setShowAddItemModal}
    />,
  );
  return { setCharacter, saveToHistory, setShowAddItemModal };
}

describe('InventoryPanel', () => {
  it('calls setShowAddItemModal when Add Item clicked', async () => {
    const user = userEvent.setup();
    const { setShowAddItemModal } = setup({ inventory: [], baseLoad: 12 });
    await user.click(screen.getByText(/add item/i));
    expect(setShowAddItemModal).toHaveBeenCalledWith(true);
  });

  it('equips item when Equip clicked', async () => {
    const user = userEvent.setup();
    const { setCharacter } = setup({
      inventory: [{ id: 1, name: 'Sword', slot: 'Weapon', equipped: false }],
    });
    await user.click(screen.getByLabelText('Equip Sword'));
    expect(setCharacter).toHaveBeenCalled();
  });

  it('uses consumable items', async () => {
    const user = userEvent.setup();
    const { setCharacter } = setup({
      inventory: [{ id: 1, name: 'Potion', type: 'consumable', quantity: 1 }],
    });
    await user.click(screen.getByText('Use'));
    expect(setCharacter).toHaveBeenCalled();
  });
});
