/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import useDiceRoller from './useDiceRoller.js';

describe('useDiceRoller contexts', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };
  const setCharacter = () => {};

  it.each([
    ['STR', 'Power through with overwhelming force!'],
    ['dex', 'Graceful and precise execution!'],
    ['Con', 'Tough as cybernetic nails!'],
    ['int', 'Brilliant tactical insight!'],
    ['Wis', 'Crystal clear perception!'],
    ['cHa', 'Surprisingly charming for a cyber-barbarian!'],
    ['hack', "Clean hit, enemy can't counter!"],
    ['TAUNT', "They're completely focused on you now!"],
    ['unknown', 'Perfect execution!'],
  ])('returns correct success context for %s', (desc, expected) => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter, false));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    act(() => {
      result.current.rollDice('2d6', desc);
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe(expected);
  });

  it('returns correct partial context for HaCk', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter, false));
    const randomSpy = vi.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(0.4).mockReturnValueOnce(0.6);
    act(() => {
      result.current.rollDice('2d6', 'HaCk');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('Hit them, but they hit you back!');
  });

  it('returns correct failure context for taunt', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter, false));
    const randomSpy = vi.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(0);
    act(() => {
      result.current.rollDice('2d6', 'taunt');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('They ignore you completely');
  });
});
