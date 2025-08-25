import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { SettingsProvider, useSettings } from './SettingsContext';

describe('SettingsContext', () => {
  afterEach(() => {
    delete import.meta.env.VITE_AUTO_XP_ON_MISS;
    delete import.meta.env.VITE_SHOW_DIAGNOSTICS;
    delete import.meta.env.VITE_SHOW_HOUSE_RULES;
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

  it('handles showDiagnostics defaults and updates', () => {
    import.meta.env.VITE_SHOW_DIAGNOSTICS = 'true';
    const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>;
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.showDiagnostics).toBe(true);
    act(() => {
      result.current.setShowDiagnostics(false);
    });
    expect(result.current.showDiagnostics).toBe(false);
  });

  it('honors initialShowDiagnostics prop', () => {
    const wrapper = ({ children }) => (
      <SettingsProvider initialShowDiagnostics={false}>{children}</SettingsProvider>
    );
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.showDiagnostics).toBe(false);
    act(() => {
      result.current.setShowDiagnostics(true);
    });
    expect(result.current.showDiagnostics).toBe(true);
  });

  it('handles showHouseRules defaults and updates', () => {
    import.meta.env.VITE_SHOW_HOUSE_RULES = 'false';
    const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>;
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.showHouseRules).toBe(false);
    act(() => {
      result.current.setShowHouseRules(true);
    });
    expect(result.current.showHouseRules).toBe(true);
  });

  it('honors initialShowHouseRules prop', () => {
    const wrapper = ({ children }) => (
      <SettingsProvider initialShowHouseRules={false}>{children}</SettingsProvider>
    );
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.showHouseRules).toBe(false);
    act(() => {
      result.current.setShowHouseRules(true);
    });
    expect(result.current.showHouseRules).toBe(true);
  });
});
