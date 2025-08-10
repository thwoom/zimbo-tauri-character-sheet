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

  it('supports uppercase D and whitespace', () => {
    const spy = vi.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.2).mockReturnValueOnce(0.8);
    expect(rollDice(' 2D6 + 3 ')).toBe(10);
    spy.mockRestore();
  });

  it('throws on non-positive counts', () => {
    expect(() => rollDice('0d6')).toThrow('count must be a positive integer');
  });

  it('throws on non-positive sides', () => {
    expect(() => rollDice('2d0')).toThrow('sides must be a positive integer');
  });
});
