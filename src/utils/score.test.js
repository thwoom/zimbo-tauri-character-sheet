import { describe, expect, it } from 'vitest';
import { scoreToMod } from './score.js';

describe('scoreToMod', () => {
  it('changes from -1 to 0 between scores 8 and 9', () => {
    expect(scoreToMod(8)).toBe(-1);
    expect(scoreToMod(9)).toBe(0);
  });

  it('changes from 0 to 1 between scores 12 and 13', () => {
    expect(scoreToMod(12)).toBe(0);
    expect(scoreToMod(13)).toBe(1);
  });

  it('changes from 2 to 3 between scores 17 and 18', () => {
    expect(scoreToMod(17)).toBe(2);
    expect(scoreToMod(18)).toBe(3);
  });
});
