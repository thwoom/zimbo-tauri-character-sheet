/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import CharacterStats from './CharacterStats';

function makeCharacter(overrides = {}) {
  return {
    stats: {
      STR: { score: 10, mod: 0 },
      DEX: { score: 10, mod: 0 },
      INT: { score: 10, mod: 0 },
    },
    hp: 5,
    maxHp: 10,
    xp: 10,
    xpNeeded: 10,
    level: 1,
    levelUpPending: false,
    alignment: 'Neutral',
    resources: {
      chronoUses: 0,
      paradoxPoints: 0,
      bandages: 1,
      rations: 1,
      advGear: 1,
    },
    ...overrides,
  };
}

describe('CharacterStats', () => {
  function renderComponent(propOverrides = {}) {
    const defaultProps = {
      character: makeCharacter(),
      setCharacter: vi.fn(),
      saveToHistory: vi.fn(),
      totalArmor: 0,
      setShowLevelUpModal: vi.fn(),
      setRollResult: vi.fn(),
      ...propOverrides,
    };
    return {
      ...render(<CharacterStats {...defaultProps} />),
      props: defaultProps,
    };
  }

  it('shows level up button when xp threshold met and triggers modal', async () => {
    const user = userEvent.setup();
    const { props } = renderComponent();
    const levelUpButton = screen.getByText(/LEVEL UP AVAILABLE/i);
    expect(levelUpButton).toBeInTheDocument();
    await user.click(levelUpButton);
    expect(props.setShowLevelUpModal).toHaveBeenCalledWith(true);
  });

  it('disables chrono-retcon button when no uses left', () => {
    renderComponent();
    const chronoButton = screen.getByRole('button', { name: /Use Chrono-Retcon/i });
    expect(chronoButton).toBeDisabled();
  });

  it('adjusts chrono-retcon uses with clamping', async () => {
    const user = userEvent.setup();
    const setCharacter = vi.fn();
    const initialCharacter = makeCharacter({
      resources: {
        chronoUses: 1,
        paradoxPoints: 0,
        bandages: 1,
        rations: 1,
        advGear: 1,
      },
    });
    renderComponent({ character: initialCharacter, setCharacter });

    const incButton = screen.getByLabelText('Increase Chrono-Retcon');
    const decButton = screen.getByLabelText('Decrease Chrono-Retcon');

    await user.click(incButton); // 1 -> 2
    let updateFn = setCharacter.mock.calls[setCharacter.mock.calls.length - 1][0];
    let state = updateFn(initialCharacter);
    expect(state.resources.chronoUses).toBe(2);

    await user.click(incButton); // Clamp at 2
    updateFn = setCharacter.mock.calls[setCharacter.mock.calls.length - 1][0];
    state = updateFn(state);
    expect(state.resources.chronoUses).toBe(2);

    await user.click(decButton); // 2 -> 1
    updateFn = setCharacter.mock.calls[setCharacter.mock.calls.length - 1][0];
    state = updateFn(state);
    expect(state.resources.chronoUses).toBe(1);

    await user.click(decButton); // 1 -> 0
    updateFn = setCharacter.mock.calls[setCharacter.mock.calls.length - 1][0];
    state = updateFn(state);
    expect(state.resources.chronoUses).toBe(0);

    await user.click(decButton); // Clamp at 0
    updateFn = setCharacter.mock.calls[setCharacter.mock.calls.length - 1][0];
    state = updateFn(state);
    expect(state.resources.chronoUses).toBe(0);
  });

  it('updates alignment when edited', async () => {
    const user = userEvent.setup();
    const setCharacter = vi.fn();
    const character = makeCharacter({ alignment: 'Neutral' });
    renderComponent({ character, setCharacter });

    const input = screen.getByLabelText(/alignment\/drive/i);
    await user.clear(input);
    await user.type(input, 'Chaotic');

    expect(setCharacter).toHaveBeenCalled();
  });
});
