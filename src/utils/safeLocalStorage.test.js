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

  it('returns fallback and logs error when getItem throws', () => {
    const original = global.localStorage;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('fail');
    global.localStorage = {
      getItem: vi.fn(() => {
        throw err;
      }),
    };
    expect(safeLocalStorage.getItem('key', 'fallback')).toBe('fallback');
    expect(errorSpy).toHaveBeenCalledWith('Failed to get localStorage item', 'key', err);
    errorSpy.mockRestore();
    global.localStorage = original;
  });

  it('logs errors from setItem and removeItem without throwing', () => {
    const original = global.localStorage;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setErr = new Error('fail set');
    const removeErr = new Error('fail remove');
    global.localStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw setErr;
      }),
      removeItem: vi.fn(() => {
        throw removeErr;
      }),
    };
    expect(() => safeLocalStorage.setItem('key', 'value')).not.toThrow();
    expect(() => safeLocalStorage.removeItem('key')).not.toThrow();
    expect(errorSpy).toHaveBeenNthCalledWith(1, 'Failed to set localStorage item', 'key', setErr);
    expect(errorSpy).toHaveBeenNthCalledWith(
      2,
      'Failed to remove localStorage item',
      'key',
      removeErr,
    );
    errorSpy.mockRestore();
    global.localStorage = original;
  });
});
