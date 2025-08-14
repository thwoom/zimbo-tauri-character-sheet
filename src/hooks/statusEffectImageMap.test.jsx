/* eslint-env jest */
import { describe, it, expect } from 'vitest';
import useStatusEffects, {
  statusEffectImageMap,
  getStatusEffectImage as getStatusEffectImageFromMap,
} from './useStatusEffects.js';

describe('statusEffectImageMap', () => {
  it('returns poisoned image and overlay when status effect active', () => {
    const character = { statusEffects: ['poisoned'], debilities: [] };
    const { getStatusEffectImage, getActiveVisualEffects } = useStatusEffects(character, () => {});

    expect(getStatusEffectImage()).toBe(statusEffectImageMap.poisoned);
    expect(getActiveVisualEffects()).toBe('poisoned-overlay');
    expect(getStatusEffectImageFromMap(character.statusEffects)).toBe(
      statusEffectImageMap.poisoned,
    );
  });

  it('uses default image when no status effects', () => {
    const character = { statusEffects: [], debilities: [] };
    const { getStatusEffectImage, getActiveVisualEffects } = useStatusEffects(character, () => {});

    expect(getStatusEffectImage()).toBe(statusEffectImageMap.default);
    expect(getActiveVisualEffects()).toBe('');
    expect(getStatusEffectImageFromMap(character.statusEffects)).toBe(statusEffectImageMap.default);
  });
});
