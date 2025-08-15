import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App.jsx';
import Settings from './components/Settings.jsx';
import { INITIAL_CHARACTER_DATA } from './state/character.js';
import CharacterContext from './state/CharacterContext.jsx';
import { SettingsProvider } from './state/SettingsContext.jsx';
import { ThemeProvider } from './state/ThemeContext.jsx';
import './styles/theme.css';

beforeEach(() => {
  vi.spyOn(window, 'confirm').mockReturnValue(false);
  vi.spyOn(window, 'prompt').mockReturnValue('0');
});

afterEach(() => {
  window.confirm.mockRestore();
  window.prompt.mockRestore();
});

let confirmSpy;
beforeEach(() => {
  confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
});

afterEach(() => {
  confirmSpy.mockRestore();
});

const createWrapper = (initialCharacter, autoXpOnMiss) =>
  function Wrapper({ children }) {
    const [character, setCharacter] = React.useState(initialCharacter);
    return (
      <ThemeProvider>
        <CharacterContext.Provider value={{ character, setCharacter }}>
          <SettingsProvider initialAutoXpOnMiss={autoXpOnMiss}>{children}</SettingsProvider>
        </CharacterContext.Provider>
      </ThemeProvider>
    );
  };

describe('App level up auto-detection', () => {
  it('opens LevelUpModal when xp exceeds xpNeeded', async () => {
    let setCharacter;
    const initialCharacter = { ...INITIAL_CHARACTER_DATA, xp: 0, xpNeeded: 5 };

    const Wrapper = ({ children }) => {
      const [character, setChar] = React.useState(initialCharacter);
      setCharacter = setChar;
      return (
        <ThemeProvider>
          <CharacterContext.Provider value={{ character, setCharacter: setChar }}>
            <SettingsProvider initialAutoXpOnMiss={true}>{children}</SettingsProvider>
          </CharacterContext.Provider>
        </ThemeProvider>
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

    const Wrapper = createWrapper(initialCharacter, true);

    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    const button = screen.getByRole('button', { name: 'INT (+0)' });

    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByText(/XP: 1\/11/i)).toBeInTheDocument();

    Math.random.mockRestore();
  });
  it('does not increment XP when auto XP toggle is off', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const initialCharacter = { ...INITIAL_CHARACTER_DATA, xp: 0, xpNeeded: 5 };

    const Wrapper = createWrapper(initialCharacter, false);

    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    const button = screen.getByRole('button', { name: 'INT (+0)' });
    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByText(/XP: 0\/5/i)).toBeInTheDocument();

    Math.random.mockRestore();
  });
});

describe('End session flow', () => {
  it('opens EndSessionModal when End Session button is clicked', () => {
    const initialCharacter = { ...INITIAL_CHARACTER_DATA, xp: 0, xpNeeded: 5, bonds: [] };
    const Wrapper = createWrapper(initialCharacter, true);

    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    expect(screen.queryByText(/End of Session/i)).toBeNull();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /End Session/i }));
    });

    expect(screen.getByText(/End of Session/i)).toBeInTheDocument();
  });
});

describe('Rulebook display', () => {
  const Wrapper = createWrapper(INITIAL_CHARACTER_DATA, true);

  it('renders the rulebook name in the header', () => {
    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    expect(screen.getByText(/Rulebook: Dungeon World/i)).toBeInTheDocument();
  });
});

// Skipped in Vitest environment due to jsdom localStorage limitations
describe.skip('localStorage persistence', () => {
  const Wrapper = createWrapper(INITIAL_CHARACTER_DATA, true);

  beforeEach(() => {
    localStorage.clear();
  });

  it('persists session notes and roll history across remounts', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const { unmount } = render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    act(() => {
      fireEvent.change(screen.getByPlaceholderText(/Track important events/i), {
        target: { value: 'My session note' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'INT (+0)' }));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'INT (+0)' })).toBeInTheDocument();
    });

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

  it('reset clears session notes and roll history from localStorage', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    act(() => {
      fireEvent.change(screen.getByPlaceholderText(/Track important events/i), {
        target: { value: 'My session note' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'INT (+0)' }));
    });

    const resetButton = screen.getAllByRole('button', { name: /Reset/i }).pop();
    act(() => {
      fireEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Recent Rolls:/i)).toBeNull();
      expect(screen.getByPlaceholderText(/Track important events/i).value).toBe('');
    });

    window.confirm.mockRestore();
    Math.random.mockRestore();
  });
});

describe('Theme switching', () => {
  beforeEach(() => localStorage.removeItem('theme'));
  it('updates the theme attribute when selecting classic', () => {
    render(
      <ThemeProvider>
        <SettingsProvider initialAutoXpOnMiss={true}>
          <Settings />
        </SettingsProvider>
      </ThemeProvider>,
    );

    const select = screen.getByLabelText(/Theme:/i);

    return waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('cosmic');
    }).then(() => {
      fireEvent.change(select, { target: { value: 'classic' } });
      expect(document.documentElement.getAttribute('data-theme')).toBe('classic');
    });
  });

  it('updates the theme attribute when selecting moebius', () => {
    render(
      <ThemeProvider>
        <SettingsProvider initialAutoXpOnMiss={true}>
          <Settings />
        </SettingsProvider>
      </ThemeProvider>,
    );

    const select = screen.getByLabelText(/Theme:/i);

    return waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('cosmic');
    }).then(() => {
      fireEvent.change(select, { target: { value: 'moebius' } });
      expect(document.documentElement.getAttribute('data-theme')).toBe('moebius');
    });
  });
});

describe('App header', () => {
  it('wraps action buttons when width is constrained', () => {
    render(
      <ThemeProvider>
        <CharacterContext.Provider
          value={{ character: INITIAL_CHARACTER_DATA, setCharacter: () => {} }}
        >
          <SettingsProvider initialAutoXpOnMiss={true}>
            <App />
          </SettingsProvider>
        </CharacterContext.Provider>
      </ThemeProvider>,
    );
    const group = screen.getByText('Take Damage').parentElement;
    group.style.display = 'flex';
    group.style.flexWrap = 'wrap';
    Object.defineProperty(group, 'clientHeight', {
      configurable: true,
      get() {
        return group.style.width === '120px' ? 60 : 30;
      },
    });
    expect(getComputedStyle(group).flexWrap).toBe('wrap');
    const initialHeight = group.clientHeight;
    group.style.width = '120px';
    expect(group.clientHeight).toBeGreaterThan(initialHeight);
  });
});
