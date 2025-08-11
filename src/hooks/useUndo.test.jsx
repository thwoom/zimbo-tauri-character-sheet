/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import { vi } from 'vitest';
import useUndo from './useUndo.js';

describe('useUndo', () => {
  it('restores previous state on undo', () => {
    vi.useFakeTimers();
    const setRollResult = vi.fn();
    const { result } = renderHook(() => {
      const [character, setCharacter] = useState({ value: 1, actionHistory: [] });
      const undo = useUndo(character, setCharacter, setRollResult);
      return { character, setCharacter, ...undo };
    });

    act(() => {
      result.current.saveToHistory('increment');
      result.current.setCharacter((prev) => ({ ...prev, value: prev.value + 1 }));
    });
    expect(result.current.character.value).toBe(2);

    act(() => {
      result.current.undoLastAction();
      vi.runAllTimers();
    });

    expect(result.current.character.value).toBe(1);
    expect(setRollResult).toHaveBeenNthCalledWith(1, '↶ Undid: increment');
    expect(setRollResult).toHaveBeenNthCalledWith(2, 'Ready to roll!');
    vi.useRealTimers();
  });
});
