import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import App from './App.jsx';
import { INITIAL_CHARACTER_DATA } from './state/character.js';
import CharacterContext from './state/CharacterContext.jsx';

describe('App level up auto-detection', () => {
  it('opens LevelUpModal when xp exceeds xpNeeded', async () => {
    let setCharacter;
    const initialCharacter = { ...INITIAL_CHARACTER_DATA, xp: 0, xpNeeded: 5 };

    const Wrapper = ({ children }) => {
      const [character, setChar] = React.useState(initialCharacter);
      setCharacter = setChar;
      return (
        <CharacterContext.Provider value={{ character, setCharacter: setChar }}>
          {children}
        </CharacterContext.Provider>
      );
    };

    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    expect(screen.queryByRole('heading', { name: /LEVEL UP!/i })).toBeNull();

    act(() => {
      setCharacter((prev) => ({ ...prev, xp: 6 }));
    });

    expect(await screen.findByRole('heading', { name: /LEVEL UP!/i })).toBeInTheDocument();
  });
});
