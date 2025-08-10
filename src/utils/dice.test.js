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
  it('handles multi-die formulas', () => {
    const spy = vi.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.2).mockReturnValueOnce(0.8).mockReturnValueOnce(0.4);
    expect(rollDice('3d6+2')).toBe(12);
    spy.mockRestore();
  });

  it('handles single die formulas', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.2);
    expect(rollDice('d8+2')).toBe(4);
    spy.mockRestore();
  });

  it('handles negative modifiers', () => {
    const spy = vi.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.75).mockReturnValueOnce(0.25);
    expect(rollDice('2d4-3')).toBe(3);
    spy.mockRestore();
  });

  it('throws on unsupported formulas', () => {
    expect(() => rollDice('2d')).toThrow('Unsupported formula');
  });
});
