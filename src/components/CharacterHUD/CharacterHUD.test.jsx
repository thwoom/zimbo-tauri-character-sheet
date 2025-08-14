import { render, screen } from '@testing-library/react';
import React from 'react';
import CharacterHUD from './CharacterHUD.jsx';
import CharacterContext from '../../state/CharacterContext.jsx';
import { statusEffectTypes } from '../../state/character.js';

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
    expect(screen.getByText('HP: 10/20')).toBeInTheDocument();
    expect(screen.getByText('Resource: 5/10')).toBeInTheDocument();
    expect(screen.getByText('Shield: 3')).toBeInTheDocument();
    expect(screen.getByTitle(statusEffectTypes.poisoned.name)).toBeInTheDocument();
    expect(screen.getByText('Fireball')).toBeInTheDocument();
  });
});
