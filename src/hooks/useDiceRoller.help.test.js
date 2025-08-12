/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import * as diceUtils from '../utils/dice.js';
import useDiceRoller from './useDiceRoller.js';

describe('useDiceRoller help reroll', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };

  it('prompts for help on failure and applies bond bonus', () => {
    const setCharacter = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('2');
    const rollSpy = vi.spyOn(diceUtils, 'rollDie');
    rollSpy
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4);

    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    act(() => {
      result.current.rollDice('2d6', 'test');
    });

    expect(confirmSpy).toHaveBeenCalled();
    expect(promptSpy).toHaveBeenCalled();
    expect(rollSpy).toHaveBeenCalledTimes(4);
    expect(result.current.rollModalData.originalResult).toBe('2d6: 1 + 1 = 2 ❌ Failure');
    expect(result.current.rollModalData.result).toBe('2d6: 3 + 4 +2 = 9 ⚠️ Partial Success');

    confirmSpy.mockRestore();
    promptSpy.mockRestore();
    rollSpy.mockRestore();
  });
});
