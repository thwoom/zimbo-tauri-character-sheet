/* eslint-env jest */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from './SettingsContext.jsx';

describe('SettingsContext', () => {
  afterEach(() => {
    delete import.meta.env.VITE_AUTO_XP_ON_MISS;
  });

  it('uses env default when initialAutoXpOnMiss is omitted', () => {
    import.meta.env.VITE_AUTO_XP_ON_MISS = 'true';
    const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>;
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.autoXpOnMiss).toBe(true);
    act(() => {
      result.current.setAutoXpOnMiss(false);
    });
    expect(result.current.autoXpOnMiss).toBe(false);
  });

  it('honors initialAutoXpOnMiss prop', () => {
    const wrapper = ({ children }) => (
      <SettingsProvider initialAutoXpOnMiss={false}>{children}</SettingsProvider>
    );
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.autoXpOnMiss).toBe(false);
    act(() => {
      result.current.setAutoXpOnMiss(true);
    });
    expect(result.current.autoXpOnMiss).toBe(true);
  });
});
