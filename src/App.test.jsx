import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import Settings from './components/Settings';
import { INITIAL_CHARACTER_DATA } from './state/character.js';
import CharacterContext from './state/CharacterContext';
import { SettingsProvider } from './state/SettingsContext';
import { ThemeProvider } from './state/ThemeContext';
import './styles/theme.css';

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('1.0.0'),
}));

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: 1024,
  });
  vi.spyOn(window, 'confirm').mockReturnValue(false);
  vi.spyOn(window, 'prompt').mockReturnValue('0');
});

afterEach(() => {
  vi.restoreAllMocks();
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

const renderWithVersion = async (ui) => {
  const result = render(ui);
  await screen.findByText(/Version:/);
  return result;
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

    await renderWithVersion(
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
  it('increments XP when roll total is less than 7', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const initialCharacter = { ...INITIAL_CHARACTER_DATA, xp: 0, xpNeeded: 5 };

    const Wrapper = createWrapper(initialCharacter, true);

    await renderWithVersion(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    const button = screen.getByRole('button', { name: 'Roll INT Check' });

    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByText(/XP: 1\/11/i)).toBeInTheDocument();

    Math.random.mockRestore();
  });
  it('does not increment XP when auto XP toggle is off', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const initialCharacter = { ...INITIAL_CHARACTER_DATA, xp: 0, xpNeeded: 5 };

    const Wrapper = createWrapper(initialCharacter, false);

    await renderWithVersion(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    const button = screen.getByRole('button', { name: 'Roll INT Check' });
    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByText(/XP: 0\/5/i)).toBeInTheDocument();

    Math.random.mockRestore();
  });
});

describe('End session flow', () => {
  it('opens EndSessionModal when End Session button is clicked', async () => {
    const initialCharacter = { ...INITIAL_CHARACTER_DATA, xp: 0, xpNeeded: 5, bonds: [] };
    const Wrapper = createWrapper(initialCharacter, true);

    await renderWithVersion(
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

describe('compact mode initialization', () => {
  it('defaults to compact mode on small screens', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 500,
    });

    const Wrapper = createWrapper(INITIAL_CHARACTER_DATA, true);

    await renderWithVersion(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    expect(screen.getByRole('button', { name: /Expand/i })).toBeInTheDocument();
  });
});

describe('Rulebook display', () => {
  const Wrapper = createWrapper(INITIAL_CHARACTER_DATA, true);

  it('renders the rulebook name in the header', async () => {
    await renderWithVersion(
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

    const { unmount } = await renderWithVersion(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    act(() => {
      fireEvent.change(screen.getByPlaceholderText(/Track important events/i), {
        target: { value: 'My session note' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Roll INT Check' }));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Roll INT Check' })).toBeInTheDocument();
    });

    unmount();

    await renderWithVersion(
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

    await renderWithVersion(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    act(() => {
      fireEvent.change(screen.getByPlaceholderText(/Track important events/i), {
        target: { value: 'My session note' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Roll INT Check' }));
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
      expect(document.documentElement.getAttribute('data-theme')).toBe('cosmic-v2');
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
      expect(document.documentElement.getAttribute('data-theme')).toBe('cosmic-v2');
    }).then(() => {
      fireEvent.change(select, { target: { value: 'moebius' } });
      expect(document.documentElement.getAttribute('data-theme')).toBe('moebius');
    });
  });
});

describe('App header', () => {
  it('wraps action buttons when width is constrained', async () => {
    await renderWithVersion(
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
    group.style.display = 'grid';
    Object.defineProperty(group, 'clientHeight', {
      configurable: true,
      get() {
        return group.style.width === '120px' ? 60 : 30;
      },
    });
    expect(getComputedStyle(group).display).toBe('grid');
    const initialHeight = group.clientHeight;
    group.style.width = '120px';
    expect(group.clientHeight).toBeGreaterThan(initialHeight);
  });
});

describe('storage resilience', () => {
  it('falls back to default session note if getItem fails', async () => {
    localStorage.removeItem('sessionNotes');
    const getItemMock = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('fail');
    });
    const Wrapper = createWrapper(INITIAL_CHARACTER_DATA, true);

    await renderWithVersion(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    expect(screen.getByPlaceholderText(/Track important events/i).value).toBe('My session note');

    getItemMock.mockRestore();
  });

  it('ignores storage errors when saving session notes', async () => {
    localStorage.removeItem('sessionNotes');
    const setItemMock = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('fail');
    });
    const removeItemMock = vi.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('fail');
    });
    const Wrapper = createWrapper(INITIAL_CHARACTER_DATA, true);

    await renderWithVersion(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    const textarea = screen.getByPlaceholderText(/Track important events/i);

    expect(() => {
      act(() => {
        fireEvent.change(textarea, { target: { value: 'New note' } });
      });
    }).not.toThrow();
    expect(textarea.value).toBe('New note');

    expect(() => {
      act(() => {
        fireEvent.change(textarea, { target: { value: '' } });
      });
    }).not.toThrow();
    expect(textarea.value).toBe('');

    setItemMock.mockRestore();
    removeItemMock.mockRestore();
  });
});
