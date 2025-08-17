import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { statusEffectTypes } from '../../state/character.js';
import CharacterContext from '../../state/CharacterContext';
import CharacterHUD from './CharacterHUD';

describe('CharacterHUD', () => {
  it('displays character data from context', () => {
    const character = {
      name: 'Zimbo',
      hp: 10,
      maxHp: 20,
      secondaryResource: 5,
      maxSecondaryResource: 10,
      shield: 3,
      statusEffects: ['poisoned'],
      castName: 'Fireball',
      castProgress: 50,
    };

    render(
      <CharacterContext.Provider value={{ character, setCharacter: () => {} }}>
        <CharacterHUD />
      </CharacterContext.Provider>,
    );

    expect(screen.getByText('Zimbo')).toBeInTheDocument();
    expect(screen.getByText('10/20')).toBeInTheDocument();
    expect(screen.getByText('5/10')).toBeInTheDocument();
    expect(screen.getByTestId('shield-bar')).toBeInTheDocument();
    expect(screen.getByTitle(statusEffectTypes.poisoned.name)).toBeInTheDocument();
    expect(screen.getByText('Fireball')).toBeInTheDocument();
  });

  it('omits secondary resource bar when secondary values are zero', () => {
    const character = {
      name: 'Zimbo',
      hp: 10,
      maxHp: 20,
      secondaryResource: 0,
      maxSecondaryResource: 0,
      shield: 0,
      statusEffects: [],
      castName: '',
      castProgress: 0,
    };

    render(
      <CharacterContext.Provider value={{ character, setCharacter: () => {} }}>
        <CharacterHUD />
      </CharacterContext.Provider>,
    );

    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(screen.queryByText(/NaN/)).toBeNull();
  });

  it('calls onMountChange when mounted', async () => {
    const onMountChange = vi.fn();
    const character = {
      name: 'Zimbo',
      hp: 10,
      maxHp: 20,
      secondaryResource: 5,
      maxSecondaryResource: 10,
      shield: 3,
      statusEffects: [],
      castName: '',
      castProgress: 0,
    };

    render(
      <CharacterContext.Provider value={{ character, setCharacter: () => {} }}>
        <CharacterHUD onMountChange={onMountChange} />
      </CharacterContext.Provider>,
    );

    await waitFor(() => expect(onMountChange).toHaveBeenCalledWith(true));
  });
});
