import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { SettingsProvider } from '../state/SettingsContext.jsx';
import * as diceUtils from '../utils/dice.js';
import useDiceRoller from './useDiceRoller.js';

const wrapper = ({ children }) => (
  <SettingsProvider initialAutoXpOnMiss={false}>{children}</SettingsProvider>
);

describe('useDiceRoller aid/interfere', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };

  it.skip('applies modifiers and enforces helper consequences on 7-9', async () => {
    const setCharacter = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockReturnValueOnce(true); // someone aids or interferes
    confirmSpy.mockReturnValueOnce(true); // choose aid
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('2');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const rollSpy = vi.spyOn(diceUtils, 'rollDie');
    rollSpy
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3) // initial roll: 6
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4); // aid roll: 7

    const { result } = renderHook(() => useDiceRoller(baseCharacter, setCharacter), { wrapper });
    await act(async () => {
      await result.current.rollDice('2d6', 'test');
    });

    expect(confirmSpy).toHaveBeenCalledTimes(2);
    expect(promptSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
    expect(result.current.rollModalData.originalResult).toBe('2d6: 3 + 3 = 6 ❌ Failure');
    expect(result.current.rollModalData.result).toBe(
      '2d6: 3 + 3 +1 = 7 (Helper Consequences) ⚠️ Partial Success',
    );

    confirmSpy.mockRestore();
    promptSpy.mockRestore();
    alertSpy.mockRestore();
    rollSpy.mockRestore();
  }, 10000);
});
