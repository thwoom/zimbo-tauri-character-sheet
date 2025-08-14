/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext.jsx';
import { DEFAULT_THEME } from './theme.js';

describe('ThemeContext', () => {
  let localStorageMock;
  let originalDocumentElement;
  let setAttributeMock;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = (() => {
      let store = {};
      return {
        getItem: vi.fn((key) => store[key] ?? null),
        setItem: vi.fn((key, value) => {
          store[key] = String(value);
        }),
        clear: () => {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });

    // Mock document.documentElement
    originalDocumentElement = document.documentElement;
    setAttributeMock = vi.fn();
    Object.defineProperty(document, 'documentElement', {
      value: { setAttribute: setAttributeMock },
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

  it('uses the default theme when none is stored', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe(DEFAULT_THEME);
  });

  it('updates the data-theme attribute when the theme changes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => {
      result.current.setTheme('classic');
    });
    expect(setAttributeMock).toHaveBeenCalledWith('data-theme', 'classic');
  });

  it('persists theme changes to localStorage and loads stored theme', () => {
    localStorage.setItem('theme', 'classic');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('classic');

    act(() => {
      result.current.setTheme('moebius');
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'moebius');
  });
});
