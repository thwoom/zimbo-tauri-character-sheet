/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import SpellsPanel from './SpellsPanel';

function makeCharacter(overrides = {}) {
  return {
    spells: [{ id: 1, name: 'Fireball', prepared: false, expended: false }],
    ...overrides,
  };
}

describe('SpellsPanel', () => {
  it('toggles preparation', async () => {
    const user = userEvent.setup();
    const setCharacter = vi.fn();
    render(
      <SpellsPanel
        character={makeCharacter()}
        setCharacter={setCharacter}
        saveToHistory={vi.fn()}
      />,
    );
    const checkbox = screen.getByLabelText('Fireball');
    await user.click(checkbox);
    const updateFn = setCharacter.mock.calls[0][0];
    const state = updateFn(makeCharacter());
    expect(state.spells[0].prepared).toBe(true);
  });

  it('casts a prepared spell', async () => {
    const user = userEvent.setup();
    const setCharacter = vi.fn();
    const character = makeCharacter({
      spells: [{ id: 1, name: 'Fireball', prepared: true, expended: false }],
    });
    render(
      <SpellsPanel character={character} setCharacter={setCharacter} saveToHistory={vi.fn()} />,
    );
    const button = screen.getByRole('button', { name: 'Cast' });
    await user.click(button);
    const updateFn = setCharacter.mock.calls[0][0];
    const state = updateFn(character);
    expect(state.spells[0].expended).toBe(true);
  });

  it('disables cast when not prepared', () => {
    const setCharacter = vi.fn();
    render(
      <SpellsPanel
        character={makeCharacter()}
        setCharacter={setCharacter}
        saveToHistory={vi.fn()}
      />,
    );
    const button = screen.getByRole('button', { name: 'Cast' });
    expect(button).toBeDisabled();
  });
});
