/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import useStatusEffects from './useStatusEffects.js';

describe('useStatusEffects', () => {
  it('toggles status effects and debilities', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({ statusEffects: [], debilities: [] });
      const status = useStatusEffects(character, setCharacter);
      return { character, ...status };
    });

    act(() => result.current.toggleStatusEffect('poisoned'));
    expect(result.current.character.statusEffects).toContain('poisoned');
    act(() => result.current.toggleStatusEffect('poisoned'));
    expect(result.current.character.statusEffects).not.toContain('poisoned');

    act(() => result.current.toggleDebility('weak'));
    expect(result.current.character.debilities).toContain('weak');
    act(() => result.current.toggleDebility('weak'));
    expect(result.current.character.debilities).not.toContain('weak');
  });

  it('returns space-separated classes for multiple active overlays', () => {
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({
        statusEffects: ['poisoned', 'confused'],
        debilities: [],
      });
      return useStatusEffects(character, setCharacter);
    });

    expect(result.current.getActiveVisualEffects()).toBe('poisoned-overlay confused-overlay');
  });
});
