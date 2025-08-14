/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import useThrottledTimer from './useThrottledTimer.js';

vi.useFakeTimers();

it('updates time on interval', () => {
  const { result } = renderHook(() => useThrottledTimer(1000));
  const first = result.current;
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  const second = result.current;
  expect(second).toBeGreaterThan(first);
});
