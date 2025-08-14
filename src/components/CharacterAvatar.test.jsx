/* eslint-env jest */
import { statusEffectImageMap } from '../hooks/useStatusEffects.js';

describe('CharacterAvatar', () => {
  it('uses SVG images for avatar states', () => {
    expect(statusEffectImageMap.default).toBe('/avatars/default.svg');
    expect(statusEffectImageMap.poisoned).toBe('/avatars/poisoned.svg');
  });
});
