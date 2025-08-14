/* eslint-env jest */
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useStatusEffects from './useStatusEffects.js';

describe('statusEffectImageMap', () => {
  it('returns poisoned overlay when status effect active', () => {
    const { result } = renderHook(() =>
      useStatusEffects({ statusEffects: ['poisoned'], debilities: [] }, () => {}),
    );
    expect(result.current.getActiveVisualEffects()).toContain('poisoned-overlay');
  });

  it('returns no overlays when no status effects', () => {
    const { result } = renderHook(() =>
      useStatusEffects({ statusEffects: [], debilities: [] }, () => {}),
    );
    expect(result.current.getActiveVisualEffects()).toBe('');
  });
});
