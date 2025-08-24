/* eslint-env jest */
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useStatusEffectTimers } from './useStatusEffectTimers';

describe('useStatusEffectTimers', () => {
  const mockCharacter = {
    statusEffects: [],
  };

  const mockSetCharacter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('initializes with empty timers', () => {
    const { result } = renderHook(() => useStatusEffectTimers(mockCharacter, mockSetCharacter));

    expect(result.current.timers).toEqual({});
    expect(result.current.getActiveTimers()).toEqual([]);
  });

  it('creates timers for new status effects', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned', 'burning'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      // Force React to flush updates
      vi.runOnlyPendingTimers();
    });

    expect(Object.keys(result.current.timers)).toHaveLength(2);
    expect(result.current.timers['poisoned_0']).toBeDefined();
    expect(result.current.timers['burning_0']).toBeDefined();
  });

  it('sets correct default durations', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned', 'burning'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.timers['poisoned_0'].duration).toBe(10);
    expect(result.current.timers['poisoned_0'].remaining).toBe(10);
    expect(result.current.timers['burning_0'].duration).toBe(3);
    expect(result.current.timers['burning_0'].remaining).toBe(3);
  });

  it('handles roll-based decrements', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned', 'burning'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    act(() => {
      result.current.handleRoll('hack_and_slash');
    });

    // Poisoned should decrement (onRoll trigger), burning should not (onDamage trigger)
    expect(result.current.timers['poisoned_0'].remaining).toBe(9);
    expect(result.current.timers['burning_0'].remaining).toBe(3);
  });

  it('handles damage-based decrements', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned', 'burning'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    act(() => {
      result.current.handleDamage();
    });

    // Burning should decrement (onDamage trigger), poisoned should not (onRoll trigger)
    expect(result.current.timers['poisoned_0'].remaining).toBe(10);
    expect(result.current.timers['burning_0'].remaining).toBe(2);
  });

  it('handles move-based decrements', () => {
    const characterWithEffects = {
      statusEffects: ['confused'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    act(() => {
      result.current.handleMove();
    });

    expect(result.current.timers['confused_0'].remaining).toBe(14);
  });

  it('prevents spam with cooldown', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // First roll should be ignored (establishes baseline)
    act(() => {
      result.current.handleRoll('hack_and_slash');
    });

    // Second roll should decrement
    act(() => {
      result.current.handleRoll('hack_and_slash');
    });

    expect(result.current.timers['poisoned_0'].remaining).toBe(9);
  });

  it('removes expired effects', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Set remaining time to 0
    act(() => {
      result.current.timers['poisoned_0'].remaining = 0;
    });

    // Force check for expired effects
    act(() => {
      result.current.checkExpiredEffects();
    });

    expect(mockSetCharacter).toHaveBeenCalledWith(expect.any(Function));
  });

  it('provides timer status information', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    const status = result.current.getTimerStatus('poisoned');

    expect(status).toEqual({
      remaining: 10,
      minutes: 10,
      seconds: 0,
      status: 'normal',
      count: 1,
    });
  });

  it('shows warning status for low timers', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Set remaining time to warning threshold
    act(() => {
      result.current.timers['poisoned_0'].remaining = 2;
    });

    const status = result.current.getTimerStatus('poisoned');
    expect(status.status).toBe('warning');
  });

  it('shows critical status for very low timers', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Set remaining time to critical threshold
    act(() => {
      result.current.timers['poisoned_0'].remaining = 0.5;
    });

    const status = result.current.getTimerStatus('poisoned');
    expect(status.status).toBe('critical');
  });

  it('allows manual timer adjustment', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    act(() => {
      result.current.adjustTimer('poisoned', 5);
    });

    expect(result.current.timers['poisoned_0'].remaining).toBe(15);
  });

  it('prevents negative timer values', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    act(() => {
      result.current.adjustTimer('poisoned', -15);
    });

    expect(result.current.timers['poisoned_0'].remaining).toBe(0);
  });

  it('handles multiple instances of the same effect', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned', 'poisoned'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(Object.keys(result.current.timers)).toHaveLength(2);
    expect(result.current.timers['poisoned_0']).toBeDefined();
    expect(result.current.timers['poisoned_1']).toBeDefined();

    const status = result.current.getTimerStatus('poisoned');
    expect(status.count).toBe(2);
    expect(status.remaining).toBe(20); // 10 + 10
  });

  it('cleans up timers when effects are removed', () => {
    const characterWithEffects = {
      statusEffects: ['poisoned', 'burning'],
    };

    const { result, rerender } = renderHook(
      ({ character }) => useStatusEffectTimers(character, mockSetCharacter),
      { initialProps: { character: characterWithEffects } },
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(Object.keys(result.current.timers)).toHaveLength(2);
    expect(result.current.timers['poisoned_0']).toBeDefined();
    expect(result.current.timers['burning_0']).toBeDefined();

    // Remove one effect
    const characterWithOneEffect = {
      statusEffects: ['poisoned'],
    };

    act(() => {
      rerender({ character: characterWithOneEffect });
      vi.runOnlyPendingTimers();
    });
    // After removing burning effect, only poisoned should remain
    expect(Object.keys(result.current.timers)).toHaveLength(1);
    expect(result.current.timers['poisoned_0']).toBeDefined();
    expect(result.current.timers['burning_0']).toBeUndefined();
  });

  it('updates configuration', () => {
    const { result } = renderHook(() => useStatusEffectTimers(mockCharacter, mockSetCharacter));

    act(() => {
      result.current.updateConfig({
        defaultDurations: {
          poisoned: 20,
        },
      });
    });

    expect(result.current.config.defaultDurations.poisoned).toBe(20);
  });

  it('handles time-based effects with countdown', () => {
    const characterWithEffects = {
      statusEffects: ['blessed'],
    };

    const { result } = renderHook(() =>
      useStatusEffectTimers(characterWithEffects, mockSetCharacter),
    );

    // Wait for the next tick to allow useEffect to run
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Blessed is a time-based effect
    expect(result.current.timers['blessed_0'].autoDecrement).toBe(false);

    // Advance time by 1 minute
    act(() => {
      vi.advanceTimersByTime(60000); // 1 minute
    });

    // Time-based effects should decrement automatically
    expect(result.current.timers['blessed_0'].remaining).toBeLessThan(20);
  });
});
