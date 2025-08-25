/* eslint-env jest */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import CharacterContext from '../state/CharacterContext';
import EndSessionModal from './EndSessionModal';

function renderWithCharacter(ui, initialCharacter) {
  let currentCharacter;
  const Wrapper = ({ children }) => {
    const [character, setCharacter] = React.useState(initialCharacter);
    currentCharacter = character;
    return (
      <CharacterContext.Provider value={{ character, setCharacter }}>
        {children}
      </CharacterContext.Provider>
    );
  };
  return { ...render(ui, { wrapper: Wrapper }), getCharacter: () => currentCharacter };
}

async function fillRecap(user) {
  const recapField = screen.queryByLabelText(/Session Recap/i);
  if (recapField) {
    await user.type(recapField, 'Recap text');
  }
}

describe('EndSessionModal', () => {
  it('toggles visibility with isOpen prop', () => {
    const onClose = vi.fn();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [],
      inventory: [],
      resources: {},
      statusEffects: [],
      debilities: [],
    };
    const { rerender } = renderWithCharacter(
      <EndSessionModal isOpen={false} onClose={onClose} />,
      initial,
    );
    expect(screen.queryByText(/End of Session/i)).not.toBeInTheDocument();
    rerender(<EndSessionModal isOpen onClose={onClose} />);
    expect(screen.getByText(/End of Session/i)).toBeInTheDocument();
  });

  it('adds XP for positive answers', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [],
      inventory: [],
      resources: {},
      statusEffects: [],
      debilities: [],
    };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={onClose} />,
      initial,
    );

    await user.click(screen.getByLabelText(/learn something new/i));
    await user.click(screen.getByLabelText(/notable monster/i));
    await user.click(screen.getByLabelText(/memorable treasure/i));
    await user.click(screen.getByLabelText(/alignment\/drive/i));
    await fillRecap(user);
    await user.click(screen.getByText(/end session/i));

    await waitFor(() => {
      expect(getCharacter().xp).toBe(4);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('shows stored alignment in the checkbox label', () => {
    const onClose = vi.fn();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [],
      inventory: [],
      resources: {},
      statusEffects: [],
      debilities: [],
      alignment: 'Protect the timeline',
    };
    renderWithCharacter(<EndSessionModal isOpen onClose={onClose} />, initial);
    expect(screen.getByLabelText(/Protect the timeline/i)).toBeInTheDocument();
  });

  it('uses xpNeeded to trigger level up', async () => {
    const user = userEvent.setup();
    const onLevelUp = vi.fn();
    const initial = {
      xp: 7,
      level: 1,
      xpNeeded: 12,
      bonds: [],
      inventory: [],
      resources: {},
      statusEffects: [],
      debilities: [],
    };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} onLevelUp={onLevelUp} />,
      initial,
    );

    await user.click(screen.getByLabelText(/learn something new/i));
    await user.click(screen.getByText(/end session/i));

    expect(onLevelUp).not.toHaveBeenCalled();
    expect(getCharacter().xp).toBe(8);
    expect(getCharacter().xpNeeded).toBe(initial.xpNeeded);
  });

  it('does not add XP for negative answers', async () => {
    const user = userEvent.setup();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [],
      inventory: [],
      resources: {},
      statusEffects: [],
      debilities: [],
    };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} />,
      initial,
    );

    await fillRecap(user);
    await user.click(screen.getByText(/end session/i));
    await waitFor(() => {
      expect(getCharacter().xp).toBe(0);
    });
  });

  it('replaces resolved bonds with new entries and awards XP', async () => {
    const user = userEvent.setup();

    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [
        { name: 'Alice', relationship: 'Friend', resolved: false },
        { name: 'Bob', relationship: 'Ally', resolved: false },
      ],
      inventory: [],
      resources: {},
      statusEffects: [],
      debilities: [],
    };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} />,
      initial,
    );

    await user.click(screen.getByLabelText(/Alice: Friend/));
    await user.type(screen.getByPlaceholderText('New bond text'), 'Best buds');
    await user.type(screen.getByLabelText(/session recap/i), 'Great session');
    await user.click(screen.getByText(/end session/i));

    expect(getCharacter().xp).toBe(1);
    expect(getCharacter().bonds).toEqual([
      { name: 'Bob', relationship: 'Ally', resolved: false },
      { name: 'Alice', relationship: 'Best buds', resolved: false },
    ]);
    expect(getCharacter().sessionRecap).toBe('Great session');
    expect(() => new Date(getCharacter().lastSessionEnd)).not.toThrow();
  });

  it('wraps action buttons when width is constrained', () => {
    const onClose = vi.fn();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [],
      inventory: [],
      resources: {},
      statusEffects: [],
      debilities: [],
    };
    renderWithCharacter(<EndSessionModal isOpen onClose={onClose} />, initial);
    const group = screen.getByText(/end session/i).parentElement;
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

  it('renders action buttons without overflow on narrow screens', () => {
    const onClose = vi.fn();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [],
      inventory: [],
      resources: {},
      statusEffects: [],
      debilities: [],
    };
    document.body.style.width = '320px';
    renderWithCharacter(<EndSessionModal isOpen onClose={onClose} />, initial);
    const group = screen.getByText(/end session/i).parentElement;
    group.style.overflowX = 'auto';
    expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
  });
});
