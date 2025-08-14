/* eslint-env jest */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from './SettingsContext.jsx';

describe('SettingsContext', () => {
  let originalEnv;

  beforeEach(() => {
    // Save and reset environment variable before each test
    originalEnv = { ...import.meta.env };
    import.meta.env.VITE_AUTO_XP_ON_MISS = 'true';
  });

  afterEach(() => {
    // Restore original environment
    import.meta.env = { ...originalEnv };
  });

  it('uses default autoXpOnMiss from env and updates with setAutoXpOnMiss', () => {
    const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>;
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.autoXpOnMiss).toBe(true);
    act(() => {
      result.current.setAutoXpOnMiss(false);
    });
    expect(result.current.autoXpOnMiss).toBe(false);
  });

  it('honors initialAutoXpOnMiss prop and updates correctly', () => {
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
