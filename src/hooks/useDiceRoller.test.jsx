/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import * as diceUtils from '../utils/dice.js';
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
    const rollDieSpy = vi.spyOn(diceUtils, 'rollDie').mockReturnValue(6);
    act(() => {
      result.current.rollDice('2d6', desc);
    });
    rollDieSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe(expected);
  });

  it('returns correct partial context for HaCk', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter, false));
    const rollDieSpy = vi.spyOn(diceUtils, 'rollDie');
    rollDieSpy.mockReturnValueOnce(3).mockReturnValueOnce(4);
    act(() => {
      result.current.rollDice('2d6', 'HaCk');
    });
    rollDieSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('Hit them, but they hit you back!');
  });

  it('returns correct failure context for taunt', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter, false));
    const rollDieSpy = vi.spyOn(diceUtils, 'rollDie').mockReturnValue(1);
    act(() => {
      result.current.rollDice('2d6', 'taunt');
    });
    rollDieSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('They ignore you completely');
  });
});

describe('useDiceRoller localStorage', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };
  const setCharacter = () => {};

  it('falls back to empty history on invalid JSON', () => {
    localStorage.clear();
    localStorage.setItem('rollHistory', 'not json');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter, false));
    expect(result.current.rollHistory).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
