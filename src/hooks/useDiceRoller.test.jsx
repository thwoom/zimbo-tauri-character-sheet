/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import useDiceRoller from './useDiceRoller.js';

beforeEach(() => {
  vi.spyOn(window, 'confirm').mockReturnValue(false);
});

afterEach(() => {
  window.confirm.mockRestore();
});

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
    ['upper hand', 'Extra brutal damage with the upper hand!'],
    ['unknown', 'Perfect execution!'],
  ])('returns correct success context for %s', (desc, expected) => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.999);
    act(() => {
      result.current.rollDice('2d6', desc);
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe(expected);
  });

  it('returns correct partial context for HaCk', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(0.35).mockReturnValueOnce(0.55);
    act(() => {
      result.current.rollDice('2d6', 'HaCk');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('Hit them, but they hit you back!');
  });

  it('returns correct partial context for upper hand', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(0.35).mockReturnValueOnce(0.55);
    act(() => {
      result.current.rollDice('2d6', 'upper hand');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('Deal damage, but lose the upper hand!');
  });

  it('returns correct failure context for taunt', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    act(() => {
      result.current.rollDice('2d6', 'taunt');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('They ignore you completely');
  });

  it('returns correct failure context for upper hand', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    act(() => {
      result.current.rollDice('2d6', 'upper hand');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('Upper hand slips away completely!');
  });

  it('updates rollResult with latest roll', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    act(() => {
      result.current.rollDice('d4', 'test');
    });
    randomSpy.mockRestore();
    expect(result.current.rollResult).toBe('d4: 1 = 1');
  });

  it('retains the original description in rollModalData', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.999);
    act(() => {
      result.current.rollDice('2d6', 'Upper Hand');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.description).toBe('Upper Hand');
  });
});

describe('XP gain on failure', () => {
  it('awards XP on 6- rolls', () => {
    localStorage.clear();
    const character = { statusEffects: [], debilities: [], xp: 0 };
    let updated = character;
    const setCharacter = (fn) => {
      updated = fn(updated);
    };
    const { result } = renderHook(() => useDiceRoller(character, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    act(() => {
      result.current.rollDice('2d6', 'str');
    });
    randomSpy.mockRestore();
    expect(updated.xp).toBe(1);
  });
});

describe('help mechanics', () => {
  it('stores original roll and adds extra XP on failed help', () => {
    localStorage.clear();
    const setCharacter = vi.fn();
    const { result } = renderHook(() =>
      useDiceRoller({ statusEffects: [], debilities: [], xp: 0 }, setCharacter),
    );
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    window.confirm.mockReturnValue(true);
    vi.spyOn(window, 'prompt').mockReturnValue('0');
    act(() => {
      result.current.rollDice('2d6', 'str');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.originalResult).toMatch(/❌ Failure/);
    expect(result.current.rollModalData.result).toMatch(/❌ Failure/);
    expect(setCharacter).toHaveBeenCalledTimes(2);
    window.prompt.mockRestore();
  });
});

describe('useDiceRoller localStorage', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };
  const setCharacter = () => {};

  it('falls back to empty history on invalid JSON', () => {
    localStorage.clear();
    localStorage.setItem('rollHistory', 'not json');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    expect(result.current.rollHistory).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('useDiceRoller mixed-case status modifiers', () => {
  const setCharacter = () => {};

  it('applies modifiers regardless of description casing', () => {
    localStorage.clear();
    const character = {
      statusEffects: ['shocked', 'weakened'],
      debilities: [],
      xp: 0,
    };
    const { result } = renderHook(() => useDiceRoller(character, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random');

    randomSpy.mockReturnValueOnce(0.4).mockReturnValueOnce(0.4);
    act(() => {
      result.current.rollDice('2d6', 'dEx test');
    });
    expect(result.current.rollModalData.result).toMatch(/Shocked \(-2 DEX\)/);

    randomSpy.mockReturnValueOnce(0.25);
    act(() => {
      result.current.rollDice('d4', 'DaMaGe roll');
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.result).toMatch(/Weakened \(-1 damage\)/);
  });
});

describe('useDiceRoller safe localStorage handling', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };
  const setCharacter = () => {};
  const original = global.localStorage;

  afterEach(() => {
    global.localStorage = original;
  });

  it('initializes with empty history when localStorage is undefined', () => {
    global.localStorage = undefined;
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    expect(result.current.rollHistory).toEqual([]);
  });

  it('initializes with empty history when localStorage throws', () => {
    global.localStorage = {
      getItem() {
        throw new Error('fail');
      },
      setItem() {
        throw new Error('fail');
      },
      removeItem() {
        throw new Error('fail');
      },
    };
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    expect(result.current.rollHistory).toEqual([]);
  });
});
