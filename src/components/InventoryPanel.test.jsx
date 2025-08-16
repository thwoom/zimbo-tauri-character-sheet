import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import useUndo from '../hooks/useUndo.js';
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
        saveToHistory={() => {}}
        setShowAddItemModal={() => {}}
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
        saveToHistory={() => {}}
        setShowAddItemModal={() => {}}
      />,
    );
    expect(screen.getByText(/Active Debilities:/i)).toBeInTheDocument();
    expect(screen.getByText(/Weak/)).toBeInTheDocument();
  });

  it('renders item descriptions', () => {
    const character = {
      inventory: [
        {
          id: 1,
          name: 'Sword',
          description: 'A sharp blade',
        },
      ],
      debilities: [],
    };
    render(
      <InventoryPanel
        character={character}
        setCharacter={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
        saveToHistory={() => {}}
        setShowAddItemModal={() => {}}
      />,
    );
    expect(screen.getByText('A sharp blade')).toBeInTheDocument();
  });

  it('displays notes and added date', () => {
    const addedAt = new Date('2024-01-01').toISOString();
    const character = {
      inventory: [{ id: 1, name: 'Sword', notes: 'gift', addedAt }],
      debilities: [],
    };
    render(
      <InventoryPanel
        character={character}
        setCharacter={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
        saveToHistory={() => {}}
      />,
    );
    expect(screen.getByText('gift')).toBeInTheDocument();
    const dateString = new Date(addedAt).toLocaleDateString();
    expect(screen.getByText(new RegExp(dateString))).toBeInTheDocument();
  });

  it('undo restores consumed item', async () => {
    const user = userEvent.setup();
    function Wrapper() {
      const [character, setCharacter] = React.useState({
        inventory: [{ id: 1, name: 'Potion', type: 'consumable', quantity: 1 }],
        debilities: [],
        actionHistory: [],
      });
      const { saveToHistory, undoLastAction } = useUndo(character, setCharacter);
      return (
        <>
          <InventoryPanel
            character={character}
            setCharacter={setCharacter}
            rollDie={() => 1}
            setRollResult={() => {}}
            saveToHistory={saveToHistory}
            setShowAddItemModal={() => {}}
          />
          <button onClick={undoLastAction}>Undo</button>
        </>
      );
    }
    render(<Wrapper />);
    await user.click(screen.getByText('Use'));
    expect(screen.queryByText('Potion')).not.toBeInTheDocument();
    await user.click(screen.getByText('Undo'));
    expect(screen.getByText('Potion')).toBeInTheDocument();
  });

  it('calls setShowAddItemModal when Add Item clicked', async () => {
    const user = userEvent.setup();
    const setShowAddItemModal = vi.fn();
    const character = { inventory: [], debilities: [] };
    render(
      <InventoryPanel
        character={character}
        setCharacter={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
        saveToHistory={() => {}}
        setShowAddItemModal={setShowAddItemModal}
      />,
    );
    await user.click(screen.getByText(/add item/i));
    expect(setShowAddItemModal).toHaveBeenCalledWith(true);
  });
});
