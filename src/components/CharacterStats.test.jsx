/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import CharacterStats from './CharacterStats.jsx';

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
      autoXpOnMiss: false,
      setAutoXpOnMiss: vi.fn(),
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

  it('toggles auto XP on miss checkbox', async () => {
    const user = userEvent.setup();
    const { props } = renderComponent();
    const checkbox = screen.getByLabelText(/Auto XP on Miss/i);
    await user.click(checkbox);
    expect(props.setAutoXpOnMiss).toHaveBeenCalled();
  });

  it('disables chrono-retcon button when no uses left', () => {
    renderComponent();
    const chronoButton = screen.getByRole('button', { name: /Chrono-Retcon/i });
    expect(chronoButton).toBeDisabled();
  });
});
