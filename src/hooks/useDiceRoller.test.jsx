/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import useDiceRoller from './useDiceRoller.js';
import * as diceUtils from '../utils/dice.js';

beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  window.alert.mockRestore();
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
  ])('returns correct success context for %s', async (desc, expected) => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.999);
    await act(async () => {
      const p = result.current.rollDice('2d6', desc);
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe(expected);
  });

  it('returns correct partial context for HaCk', async () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(0.35).mockReturnValueOnce(0.55);
    await act(async () => {
      const p = result.current.rollDice('2d6', 'HaCk');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('Hit them, but they hit you back!');
  });

  it('returns correct partial context for upper hand', async () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(0.35).mockReturnValueOnce(0.55);
    await act(async () => {
      const p = result.current.rollDice('2d6', 'upper hand');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('Deal damage, but lose the upper hand!');
  });

  it('returns correct failure context for taunt', async () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => {
      const p = result.current.rollDice('2d6', 'taunt');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('They ignore you completely');
  });

  it('returns correct failure context for upper hand', async () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => {
      const p = result.current.rollDice('2d6', 'upper hand');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.context).toBe('Upper hand slips away completely!');
  });

  it('updates rollResult with latest roll', async () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => {
      const p = result.current.rollDice('d4', 'test');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    randomSpy.mockRestore();
    expect(result.current.rollResult).toBe('d4: 1 = 1');
  });

  it('retains the original description in rollModalData', async () => {
    localStorage.clear();
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.999);
    await act(async () => {
      const p = result.current.rollDice('2d6', 'Upper Hand');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    randomSpy.mockRestore();
    expect(result.current.rollModalData.description).toBe('Upper Hand');
  });
});

describe('useDiceRoller aid/interfere', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };

  it('applies modifiers and enforces helper consequences on 7-9', async () => {
    const setCharacter = vi.fn();
    const alertSpy = vi.spyOn(window, 'alert');
    const rollSpy = vi.spyOn(diceUtils, 'rollDie');
    rollSpy
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4);
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    await act(async () => {
      const p = result.current.rollDice('2d6', 'test');
      await Promise.resolve();
      result.current.aidModal.onConfirm({ action: 'aid', bond: 2 });
      await p;
    });
    expect(alertSpy).toHaveBeenCalled();
    expect(result.current.rollModalData.originalResult).toBe('2d6: 3 + 3 = 6 ❌ Failure');
    expect(result.current.rollModalData.result).toBe(
      '2d6: 3 + 3 +1 = 7 (Helper Consequences) ⚠️ Partial Success',
    );
    alertSpy.mockRestore();
    rollSpy.mockRestore();
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

  it('applies modifiers regardless of description casing', async () => {
    localStorage.clear();
    const character = {
      statusEffects: ['shocked', 'weakened'],
      debilities: [],
      xp: 0,
    };
    const { result } = renderHook(() => useDiceRoller(character, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random');

    randomSpy.mockReturnValueOnce(0.4).mockReturnValueOnce(0.4);
    await act(async () => {
      const p = result.current.rollDice('2d6', 'dEx test');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    expect(result.current.rollModalData.result).toMatch(/Shocked \(-2 DEX\)/);

    randomSpy.mockReturnValueOnce(0.25);
    await act(async () => {
      const p = result.current.rollDice('d4', 'DaMaGe roll');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
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

describe('useDiceRoller XP on miss handling', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };

  it('does not grant XP when autoXpOnMiss is undefined', async () => {
    localStorage.clear();
    const setCharacter = vi.fn();
    const previousSetting = globalThis.autoXpOnMiss;
    delete globalThis.autoXpOnMiss;
    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => {
      const p = result.current.rollDice('2d6', 'test');
      await Promise.resolve();
      result.current.aidModal.onCancel();
      await p;
    });
    randomSpy.mockRestore();
    expect(setCharacter).not.toHaveBeenCalled();
    globalThis.autoXpOnMiss = previousSetting;
  });
});
