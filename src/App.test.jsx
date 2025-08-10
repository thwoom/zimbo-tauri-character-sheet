import { render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  it('does not increment XP when auto XP toggle is off', () => {
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

    const toggle = screen.getByLabelText(/Auto XP on Miss/i);
    act(() => {
      fireEvent.click(toggle);
    });

    const button = screen.getByRole('button', { name: 'INT (+0)' });
    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByText(/XP: 0\/5/i)).toBeInTheDocument();

    Math.random.mockRestore();
  });
});

describe('localStorage persistence', () => {
  const Wrapper = ({ children }) => {
    const [character, setCharacter] = React.useState(INITIAL_CHARACTER_DATA);
    return (
      <CharacterContext.Provider value={{ character, setCharacter }}>
        {children}
      </CharacterContext.Provider>
    );
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('persists session notes and roll history across remounts', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const { unmount } = render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    fireEvent.change(screen.getByPlaceholderText(/Track important events/i), {
      target: { value: 'My session note' },
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'INT (+0)' }));
    });

    expect(localStorage.getItem('sessionNotes')).toBe('My session note');
    expect(JSON.parse(localStorage.getItem('rollHistory')).length).toBe(1);

    unmount();

    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    expect(screen.getByPlaceholderText(/Track important events/i).value).toBe('My session note');
    expect(screen.getByText(/Recent Rolls:/i)).toBeInTheDocument();

    Math.random.mockRestore();
  });

  it('reset clears session notes and roll history from localStorage', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    fireEvent.change(screen.getByPlaceholderText(/Track important events/i), {
      target: { value: 'My session note' },
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'INT (+0)' }));
    });

    const resetButton = screen.getAllByRole('button', { name: /Reset/i }).pop();
    fireEvent.click(resetButton);

    expect(localStorage.getItem('sessionNotes')).toBeNull();
    expect(localStorage.getItem('rollHistory')).toBeNull();
    expect(screen.queryByText(/Recent Rolls:/i)).toBeNull();
    expect(screen.getByPlaceholderText(/Track important events/i).value).toBe('');

    window.confirm.mockRestore();
    Math.random.mockRestore();
  });
});
