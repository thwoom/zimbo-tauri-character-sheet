/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import CharacterContext from '../state/CharacterContext.jsx';
import EndSessionModal from './EndSessionModal.jsx';

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

describe('EndSessionModal', () => {
  it('toggles visibility with isOpen prop', () => {
    const onClose = vi.fn();
    const initial = { xp: 0, level: 1, xpNeeded: 8, bonds: [] };
    const { rerender } = renderWithCharacter(
      <EndSessionModal isOpen={false} onClose={onClose} onLevelUp={() => {}} />,
      initial,
    );
    expect(screen.queryByText(/End of Session/i)).not.toBeInTheDocument();
    rerender(<EndSessionModal isOpen onClose={onClose} onLevelUp={() => {}} />);
    expect(screen.getByText(/End of Session/i)).toBeInTheDocument();
  });

  it('adds XP for positive answers', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const initial = { xp: 0, level: 1, xpNeeded: 8, bonds: [] };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={onClose} onLevelUp={() => {}} />,
      initial,
    );

    await user.click(screen.getByLabelText(/learn something new/i));
    await user.click(screen.getByLabelText(/notable monster/i));
    await user.click(screen.getByLabelText(/memorable treasure/i));
    await user.click(screen.getByLabelText(/alignment\/drive/i));
    await user.click(screen.getByText(/end session/i));

    expect(getCharacter().xp).toBe(4);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not add XP for negative answers', async () => {
    const user = userEvent.setup();
    const initial = { xp: 0, level: 1, xpNeeded: 8, bonds: [] };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} onLevelUp={() => {}} />,
      initial,
    );

    await user.click(screen.getByText(/end session/i));
    expect(getCharacter().xp).toBe(0);
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
    };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} onLevelUp={() => {}} />,
      initial,
    );

    await user.click(screen.getByLabelText(/Alice: Friend/));
    await user.type(screen.getByPlaceholderText('New bond text'), 'Best buds');
    await user.click(screen.getByText(/end session/i));

    expect(getCharacter().xp).toBe(1);
    expect(getCharacter().bonds).toEqual([
      { name: 'Bob', relationship: 'Ally', resolved: false },
      { name: 'Alice', relationship: 'Best buds', resolved: false },
    ]);
  });

  it('saves recap privately when not shared', async () => {
    const user = userEvent.setup();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [],
      sessionNotes: '',
      sessionRecapPublic: '',
    };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} onLevelUp={() => {}} />,
      initial,
    );

    await user.type(screen.getByPlaceholderText(/what happened this session/i), 'Private recap');
    await user.click(screen.getByText(/end session/i));

    expect(getCharacter().sessionNotes).toBe('Private recap');
    expect(getCharacter().sessionRecapPublic).toBe('');
  });

  it('saves recap publicly when shared', async () => {
    const user = userEvent.setup();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [],
      sessionNotes: '',
      sessionRecapPublic: '',
    };
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} onLevelUp={() => {}} />,
      initial,
    );

    await user.type(screen.getByPlaceholderText(/what happened this session/i), 'Public recap');
    await user.click(screen.getByLabelText(/share recap publicly/i));
    await user.click(screen.getByText(/end session/i));

    expect(getCharacter().sessionNotes).toBe('Public recap');
    expect(getCharacter().sessionRecapPublic).toBe('Public recap');
  });
});
