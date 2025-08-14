/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import SessionNotes from './SessionNotes.jsx';
import styles from './SessionNotes.module.css';
import { saveFile, loadFile } from '../utils/fileStorage.js';

vi.mock('../utils/fileStorage.js', () => ({
  saveFile: vi.fn(),
  loadFile: vi.fn(),
}));

describe('SessionNotes', () => {
  it('updates notes when typing', async () => {
    const user = userEvent.setup();
    const setSessionNotes = vi.fn();
    render(
      <SessionNotes
        sessionNotes=""
        setSessionNotes={setSessionNotes}
        compactMode
        setCompactMode={() => {}}
      />,
    );
    const textarea = screen.getByPlaceholderText(/Track important events/);
    await user.type(textarea, 'Hi');
    expect(setSessionNotes).toHaveBeenCalled();
  });

  it('toggles compact mode', async () => {
    const user = userEvent.setup();
    const setCompactMode = vi.fn();
    render(
      <SessionNotes
        sessionNotes=""
        setSessionNotes={() => {}}
        compactMode={false}
        setCompactMode={setCompactMode}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Compact/i }));
    expect(setCompactMode).toHaveBeenCalledWith(true);
  });

  it('clears notes when confirmed', async () => {
    const user = userEvent.setup();
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);
    const setSessionNotes = vi.fn();
    render(
      <SessionNotes
        sessionNotes="some"
        setSessionNotes={setSessionNotes}
        compactMode
        setCompactMode={() => {}}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Clear/i }));
    expect(window.confirm).toHaveBeenCalled();
    expect(setSessionNotes).toHaveBeenCalledWith('');
    window.confirm = originalConfirm;
  });

  it('applies fullWidth class when not in compact mode', () => {
    render(
      <SessionNotes
        sessionNotes=""
        setSessionNotes={() => {}}
        compactMode={false}
        setCompactMode={() => {}}
      />,
    );
    const container = screen.getByText(/Session Notes/).parentElement;
    expect(container).toHaveClass(styles.fullWidth);
  });

  it('saves notes using fileStorage', async () => {
    const user = userEvent.setup();
    const setSessionNotes = vi.fn();
    render(
      <SessionNotes
        sessionNotes="hello"
        setSessionNotes={setSessionNotes}
        compactMode
        setCompactMode={() => {}}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Save/i }));
    expect(saveFile).toHaveBeenCalledWith('session_notes.txt', 'hello');
  });

  it('loads notes using fileStorage', async () => {
    const user = userEvent.setup();
    const setSessionNotes = vi.fn();
    loadFile.mockResolvedValueOnce('loaded');
    render(
      <SessionNotes
        sessionNotes=""
        setSessionNotes={setSessionNotes}
        compactMode
        setCompactMode={() => {}}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Load/i }));
    expect(loadFile).toHaveBeenCalledWith('session_notes.txt');
    expect(setSessionNotes).toHaveBeenCalledWith('loaded');
  });

  it('shows warning when persistence unavailable', async () => {
    const originalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: undefined,
    });
    render(
      <SessionNotes
        sessionNotes=""
        setSessionNotes={() => {}}
        compactMode
        setCompactMode={() => {}}
      />,
    );
    expect(await screen.findByText(/Persistence unavailable/)).toBeInTheDocument();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: originalStorage,
    });
  });
});
