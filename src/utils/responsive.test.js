import { describe, it, expect, vi } from 'vitest';
import { isCompactWidth, SCREEN_SM } from './responsive';

describe('isCompactWidth', () => {
  it('returns false when window is undefined', () => {
    const originalWindow = globalThis.window;
    vi.stubGlobal('window', undefined);
    expect(isCompactWidth()).toBe(false);
    vi.stubGlobal('window', originalWindow);
  });

  it('detects compact widths', () => {
    const originalWindow = globalThis.window;
    vi.stubGlobal('window', { innerWidth: SCREEN_SM - 1 });
    expect(isCompactWidth()).toBe(true);
    vi.stubGlobal('window', originalWindow);
  });
});
