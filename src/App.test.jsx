import { render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
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

describe('XP gain on miss', () => {
  it('increments XP when roll total is less than 7', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const initialCharacter = { ...INITIAL_CHARACTER_DATA, xp: 0, xpNeeded: 5 };

    const Wrapper = ({ children }) => {
      const [character, setCharacter] = React.useState(initialCharacter);
      return (
        <CharacterContext.Provider value={{ character, setCharacter }}>
          {children}
        </CharacterContext.Provider>
      );
    };

    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    const button = screen.getByRole('button', { name: 'INT (+0)' });

    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByText(/XP: 1\/5/i)).toBeInTheDocument();

    Math.random.mockRestore();
  });
});
