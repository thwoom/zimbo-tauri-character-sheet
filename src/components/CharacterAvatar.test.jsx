/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CharacterAvatar from './CharacterAvatar.jsx';

describe('CharacterAvatar', () => {
  it('applies poisoned overlay when status effect active', () => {
    const character = { statusEffects: ['poisoned'], debilities: [] };
    render(<CharacterAvatar character={character} />);
    const svg = screen.getByRole('img', { name: /character avatar/i });
    expect(svg.parentElement).toHaveClass('poisoned-overlay');
    expect(svg.querySelector('path')).toBeInTheDocument();
  });

  it('renders silhouette without overlays when no status effects', () => {
    const character = { statusEffects: [], debilities: [] };
    render(<CharacterAvatar character={character} />);
    const svg = screen.getByRole('img', { name: /character avatar/i });
    expect(svg.parentElement).not.toHaveClass('poisoned-overlay');
  });

  it('calls onPortraitClick when activated', async () => {
    const character = { statusEffects: [], debilities: [] };
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<CharacterAvatar character={character} onPortraitClick={handleClick} />);
    const svg = screen.getByRole('img', { name: /character avatar/i });
    await user.click(svg);
    expect(handleClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(svg, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
