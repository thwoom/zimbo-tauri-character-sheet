/* eslint-env jest */
import { describe, it, expect, vi } from 'vitest';
import safeLocalStorage from './safeLocalStorage.js';

describe('safeLocalStorage', () => {
  it('returns fallback and does not throw when localStorage is undefined', () => {
    const original = global.localStorage;
    global.localStorage = undefined;
    expect(safeLocalStorage.getItem('key', 'fallback')).toBe('fallback');
    expect(() => safeLocalStorage.setItem('key', 'value')).not.toThrow();
    expect(() => safeLocalStorage.removeItem('key')).not.toThrow();
    global.localStorage = original;
  });

  it('returns fallback when getItem throws', () => {
    const original = global.localStorage;
    global.localStorage = {
      getItem: vi.fn(() => {
        throw new Error('fail');
      }),
    };
    expect(safeLocalStorage.getItem('key', 'fallback')).toBe('fallback');
    global.localStorage = original;
  });

  it('swallows errors from setItem and removeItem', () => {
    const original = global.localStorage;
    global.localStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error('fail');
      }),
      removeItem: vi.fn(() => {
        throw new Error('fail');
      }),
    };
    expect(() => safeLocalStorage.setItem('key', 'value')).not.toThrow();
    expect(() => safeLocalStorage.removeItem('key')).not.toThrow();
    global.localStorage = original;
  });
});
