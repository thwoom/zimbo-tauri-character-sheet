/* eslint-env jest */
import { invoke } from '@tauri-apps/api/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import CharacterContext from '../state/CharacterContext.jsx';
import EndSessionModal from './EndSessionModal.jsx';

vi.mock('@tauri-apps/api/core', () => ({ invoke: vi.fn() }));

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
  beforeEach(() => {
    invoke.mockReset();
  });
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
    invoke.mockResolvedValue();
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={onClose} onLevelUp={() => {}} />,
      initial,
    );

    await user.click(screen.getByLabelText(/learn something new/i));
    await user.click(screen.getByLabelText(/notable monster/i));
    await user.click(screen.getByLabelText(/memorable treasure/i));
    await user.click(screen.getByLabelText(/alignment\/drive/i));
    await user.click(screen.getByText(/end session/i));

    await waitFor(() => {
      expect(getCharacter().xp).toBe(4);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('does not add XP for negative answers', async () => {
    const user = userEvent.setup();
    const initial = { xp: 0, level: 1, xpNeeded: 8, bonds: [] };
    invoke.mockResolvedValue();
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} onLevelUp={() => {}} />,
      initial,
    );

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
    };
    invoke.mockResolvedValue();
    const { getCharacter } = renderWithCharacter(
      <EndSessionModal isOpen onClose={() => {}} onLevelUp={() => {}} />,
      initial,
    );

    await user.click(screen.getByLabelText(/Alice: Friend/));
    await user.type(screen.getByPlaceholderText('New bond text'), 'Best buds');
    await user.click(screen.getByText(/end session/i));

    await waitFor(() => {
      expect(getCharacter().xp).toBe(1);
      expect(getCharacter().bonds).toEqual([
        { name: 'Bob', relationship: 'Ally', resolved: false },
        { name: 'Alice', relationship: 'Best buds', resolved: false },
      ]);
    });
  });

  it('shows retry options and retains text when save fails', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const initial = {
      xp: 0,
      level: 1,
      xpNeeded: 8,
      bonds: [{ name: 'Alice', relationship: 'Friend', resolved: false }],
    };
    invoke.mockRejectedValueOnce(new Error('fail'));
    renderWithCharacter(<EndSessionModal isOpen onClose={onClose} onLevelUp={() => {}} />, initial);

    await user.click(screen.getByLabelText(/Alice: Friend/));
    await user.type(screen.getByPlaceholderText('New bond text'), 'Best buds');
    await user.click(screen.getByText(/end session/i));

    expect(screen.getByText(/Failed to save/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New bond text')).toHaveValue('Best buds');
    expect(onClose).not.toHaveBeenCalled();
  });
});
