import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import safeLocalStorage from '../utils/safeLocalStorage.js';
import { DEFAULT_THEME } from './theme.js';
import { ThemeProvider, useTheme } from './ThemeContext';

vi.mock('../utils/safeLocalStorage.js', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

describe('ThemeContext', () => {
  let originalDocumentElement;
  let setAttributeMock;

  beforeEach(() => {
    safeLocalStorage.getItem.mockReset();
    safeLocalStorage.setItem.mockReset();

    originalDocumentElement = document.documentElement;
    setAttributeMock = vi.fn();
    Object.defineProperty(document, 'documentElement', {
      value: { setAttribute: setAttributeMock },
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      configurable: true,
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

  it('uses the default theme when none is stored', () => {
    safeLocalStorage.getItem.mockImplementation((key, fallback) => fallback);
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe(DEFAULT_THEME);
    expect(safeLocalStorage.getItem).toHaveBeenCalledWith('theme', DEFAULT_THEME);
  });

  it('updates the data-theme attribute when the theme changes', () => {
    safeLocalStorage.getItem.mockImplementation((key, fallback) => fallback);
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => {
      result.current.setTheme('arwes');
    });
    expect(setAttributeMock).toHaveBeenCalledWith('data-theme', 'arwes');
    expect(safeLocalStorage.setItem).toHaveBeenCalledWith('theme', 'arwes');
  });

  it('persists theme changes and loads stored theme', () => {
    safeLocalStorage.getItem.mockReturnValue('classic');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('classic');

    act(() => {
      result.current.setTheme('moebius');
    });
    expect(safeLocalStorage.setItem).toHaveBeenCalledWith('theme', 'moebius');
  });
});
