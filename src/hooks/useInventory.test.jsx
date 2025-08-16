/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import useInventory from './useInventory.js';

describe('useInventory calculations', () => {
  it('calculates totalArmor with base armor and equipped items', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({
        armor: 1,
        inventory: [
          { id: 'helmet', armor: 2, equipped: true },
          { id: 'boots', armor: 1, equipped: false },
        ],
      });
      const inventory = useInventory(character, setCharacter);
      return { ...inventory, character };
    });

    expect(result.current.totalArmor).toBe(3);

    act(() => result.current.handleEquipItem('helmet'));
    expect(result.current.totalArmor).toBe(1);
  });

  it('returns base armor when no items are equipped', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({
        armor: 2,
        inventory: [{ id: 'helmet', armor: 2, equipped: false }],
      });
      return useInventory(character, setCharacter);
    });

    expect(result.current.totalArmor).toBe(2);
  });
});

describe('useInventory equippedWeaponDamage', () => {
  it('returns damage of equipped weapon', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({
        inventory: [{ id: 'sword', type: 'weapon', damage: 'd8', equipped: true }],
      });
      return useInventory(character, setCharacter);
    });
    expect(result.current.equippedWeaponDamage).toBe('d8');
  });

  it('defaults to d6 when no weapon is equipped', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({ inventory: [] });
      return useInventory(character, setCharacter);
    });
    expect(result.current.equippedWeaponDamage).toBe('d6');
  });

  it('defaults to d6 when equipped weapon has no damage value', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({
        inventory: [{ id: 'club', type: 'weapon', equipped: true }],
      });
      return useInventory(character, setCharacter);
    });
    expect(result.current.equippedWeaponDamage).toBe('d6');
  });
});

describe('useInventory actions', () => {
  it('adds items with handleAddItem including timestamp and notes', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({ inventory: [] });
      const inventory = useInventory(character, setCharacter);
      return { ...inventory, character };
    });

    act(() => result.current.handleAddItem({ id: 'potion', name: 'Potion', quantity: 1 }));

    expect(result.current.character.inventory[0]).toMatchObject({
      id: 'potion',
      name: 'Potion',
      quantity: 1,
      notes: '',
    });
    expect(result.current.character.inventory[0].addedAt).toBeDefined();
  });

  it('toggles item equipment state with handleEquipItem', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({
        inventory: [{ id: 'shield', equipped: false, addedAt: '2024-01-01', notes: '' }],
      });
      const inventory = useInventory(character, setCharacter);
      return { ...inventory, character };
    });

    act(() => result.current.handleEquipItem('shield'));
    expect(result.current.character.inventory[0].equipped).toBe(true);

    act(() => result.current.handleEquipItem('shield'));
    expect(result.current.character.inventory[0].equipped).toBe(false);
  });

  it('reduces quantity or removes items with handleConsumeItem', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({
        inventory: [{ id: 'potion', quantity: 2, addedAt: '2024-01-01', notes: 'healing' }],
      });
      const inventory = useInventory(character, setCharacter);
      return { ...inventory, character };
    });

    act(() => result.current.handleConsumeItem('potion'));
    expect(result.current.character.inventory[0]).toMatchObject({
      quantity: 1,
      addedAt: '2024-01-01',
      notes: 'healing',
    });

    act(() => result.current.handleConsumeItem('potion'));
    expect(result.current.character.inventory.find((i) => i.id === 'potion')).toBeUndefined();
  });

  it('removes items with handleDropItem', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({
        inventory: [
          { id: 'rock', addedAt: '2024-01-01', notes: '' },
          { id: 'coin', addedAt: '2024-01-02', notes: 'shiny' },
        ],
      });
      const inventory = useInventory(character, setCharacter);
      return { ...inventory, character };
    });

    act(() => result.current.handleDropItem('rock'));
    expect(result.current.character.inventory).toEqual([
      { id: 'coin', addedAt: '2024-01-02', notes: 'shiny' },
    ]);
  });
});
