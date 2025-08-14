import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './App.jsx';
import { INITIAL_CHARACTER_DATA } from './state/character.js';
import CharacterContext from './state/CharacterContext.jsx';
import { ThemeProvider } from './state/ThemeContext.jsx';

function renderApp(overrides = {}) {
  const initialCharacter = { ...INITIAL_CHARACTER_DATA, ...overrides };
  const Wrapper = ({ children }) => {
    const [character, setCharacter] = React.useState(initialCharacter);
    return (
      <ThemeProvider>
        <CharacterContext.Provider value={{ character, setCharacter }}>
          {children}
        </CharacterContext.Provider>
      </ThemeProvider>
    );
  };
  return render(
    <Wrapper>
      <App />
    </Wrapper>,
  );
}

beforeEach(() => {
  vi.spyOn(window, 'confirm').mockReturnValue(false);
  vi.spyOn(window, 'prompt').mockReturnValue('0');
});

afterEach(() => {
  window.confirm.mockRestore();
  window.prompt.mockRestore();
});

describe('HUD accessibility', () => {
  it('provides keyboard navigation through HUD elements', async () => {
    renderApp({ statusEffects: ['poisoned', 'burning'] });
    const user = userEvent.setup();

    await user.tab();
    expect(screen.getByRole('heading', { name: /zimbo/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('img', { name: /character avatar/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('progressbar', { name: /health points/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('progressbar', { name: /experience points/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('status', { name: /poisoned/i })).toHaveFocus();
  });

  it('exposes ARIA attributes for bars and status chips', () => {
    renderApp({
      hp: 5,
      maxHp: 10,
      xp: 2,
      xpNeeded: 5,
      statusEffects: ['poisoned'],
    });

    const hpBar = screen.getByRole('progressbar', { name: /health points/i });
    expect(hpBar).toHaveAttribute('aria-valuenow', '5');
    expect(hpBar).toHaveAttribute('aria-valuemin', '0');
    expect(hpBar).toHaveAttribute('aria-valuemax', '10');

    const chip = screen.getByRole('status', { name: /poisoned/i });
    expect(chip).toHaveAttribute('aria-label', expect.stringContaining('Stack count: 1'));
  });
});
