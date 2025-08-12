/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import * as diceUtils from '../utils/dice.js';
import useDiceRoller from './useDiceRoller.js';

describe('useDiceRoller aid/interfere', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };

  it('handles aid with helper consequences', () => {
    const setCharacter = vi.fn();
    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('1');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const rollSpy = vi.spyOn(diceUtils, 'rollDie');
    rollSpy
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3);

    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter));
    act(() => {
      result.current.rollDice('2d6', 'test');
    });

    expect(confirmSpy).toHaveBeenCalledTimes(2);
    expect(promptSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Helper Consequences');
    expect(rollSpy).toHaveBeenCalledTimes(4);
    expect(result.current.rollModalData.originalResult).toBe('2d6: 3 + 3 = 6 ❌ Failure');
    expect(result.current.rollModalData.result).toBe(
      '2d6: 6 +1 = 7 (Helper Consequences) ⚠️ Partial Success',
    );

    confirmSpy.mockRestore();
    promptSpy.mockRestore();
    alertSpy.mockRestore();
    rollSpy.mockRestore();
  });
});
