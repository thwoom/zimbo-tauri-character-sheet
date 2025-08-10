// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { rollDie, rollDice } from './dice.js';

describe('rollDie', () => {
  it('returns a value within 1..sides', () => {
    const spy = vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
      // force rollDie to return 4
      arr[0] = 3; // (3 % 6) + 1 => 4
      return arr;
    });
    expect(rollDie(6)).toBe(4);
    spy.mockRestore();
  });
});

describe('rollDice', () => {
  it('handles multi-die formulas', () => {
    const spy = vi.spyOn(crypto, 'getRandomValues');
    spy
      .mockImplementationOnce((arr) => {
        arr[0] = 1; // (1 % 6) + 1 => 2
        return arr;
      })
      .mockImplementationOnce((arr) => {
        arr[0] = 4; // -> 5
        return arr;
      })
      .mockImplementationOnce((arr) => {
        arr[0] = 2; // -> 3
        return arr;
      });
    expect(rollDice('3d6+2')).toBe(12);
    spy.mockRestore();
  });

  it('handles single die formulas', () => {
    const spy = vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
      arr[0] = 1; // (1 % 8) + 1 => 2
      return arr;
    });
    expect(rollDice('d8+2')).toBe(4);
    spy.mockRestore();
  });

  it('handles negative modifiers', () => {
    const spy = vi.spyOn(crypto, 'getRandomValues');
    spy
      .mockImplementationOnce((arr) => {
        arr[0] = 3; // (3 % 4) + 1 => 4
        return arr;
      })
      .mockImplementationOnce((arr) => {
        arr[0] = 1; // -> 2
        return arr;
      });
    expect(rollDice('2d4-3')).toBe(3);
    spy.mockRestore();
  });

  it('throws on unsupported formulas', () => {
    expect(() => rollDice('2d')).toThrow('Unsupported formula');
  });
});
