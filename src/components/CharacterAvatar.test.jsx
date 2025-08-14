/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CharacterAvatar from './CharacterAvatar.jsx';

describe('CharacterAvatar', () => {
  it('applies poisoned overlay and image when status effect active', () => {
    const character = { statusEffects: ['poisoned'], debilities: [] };
    render(<CharacterAvatar character={character} />);
    const img = screen.getByRole('img', { name: /character avatar/i });
    expect(img.getAttribute('src')).toBe('/avatars/poisoned.svg');
    expect(img.parentElement).toHaveClass('poisoned-overlay');
  });

  it('uses default image when no status effects', () => {
    const character = { statusEffects: [], debilities: [] };
    render(<CharacterAvatar character={character} />);
    const img = screen.getByRole('img', { name: /character avatar/i });
    expect(img.getAttribute('src')).toBe('/avatars/default.svg');
  });
});
