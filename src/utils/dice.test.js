import { describe, expect, it, vi } from 'vitest';
import { rollDie, rollDice } from './dice.js';

describe('rollDie', () => {
  it('returns a value within 1..sides', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(rollDie(6)).toBe(4);
    spy.mockRestore();
  });
});

describe('rollDice', () => {
  it('handles 2d6 formulas', () => {
    const spy = vi.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.1).mockReturnValueOnce(0.6);
    expect(rollDice('2d6+1')).toBe(6);
    spy.mockRestore();
  });

  it('handles single die formulas', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.2);
    expect(rollDice('d8+2')).toBe(4);
    spy.mockRestore();
  });

  it('throws on unsupported formulas', () => {
    expect(() => rollDice('3d6')).toThrow('Unsupported formula');
  });
});
