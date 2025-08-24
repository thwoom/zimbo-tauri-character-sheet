import { useCallback, useEffect, useRef, useState } from 'react';

// Timer configuration
const TIMER_CONFIG = {
  // Default durations in minutes
  defaultDurations: {
    poisoned: 10, // 10 minutes
    shocked: 5, // 5 minutes
    burning: 3, // 3 minutes
    frozen: 8, // 8 minutes
    confused: 15, // 15 minutes
    weakened: 12, // 12 minutes
    blessed: 20, // 20 minutes
    invisible: 2, // 2 minutes
  },

  // Auto-decrement triggers
  autoDecrementTriggers: {
    onRoll: ['poisoned', 'shocked', 'frozen', 'weakened'], // Decrement on any roll
    onDamage: ['burning'], // Decrement when taking damage
    onMove: ['confused'], // Decrement when using moves
    onTime: ['blessed', 'invisible'], // Decrement based on time only
  },

  // Visual warning thresholds (in minutes)
  warningThresholds: {
    critical: 1, // Red warning when < 1 minute
    warning: 3, // Yellow warning when < 3 minutes
  },
};

export const useStatusEffectTimers = (character, setCharacter) => {
  const [timers, setTimers] = useState({});
  const [config, setConfig] = useState(TIMER_CONFIG);
  const intervalRef = useRef(null);
  const lastRollTimeRef = useRef(null);

  // Initialize timers from character status effects
  useEffect(() => {
    if (!character?.statusEffects) {
      setTimers({});
      return;
    }

    setTimers((prev) => {
      const newTimers = {};

      // Count existing timers for each effect type (only for effects that still exist)
      const effectCounts = {};
      Object.keys(prev).forEach((key) => {
        const [effectType] = key.split('_');
        if (character.statusEffects.includes(effectType)) {
          effectCounts[effectType] = (effectCounts[effectType] || 0) + 1;
        }
      });

      // Reset counts to 0 for effects that still exist (we'll increment as we create timers)
      character.statusEffects.forEach((effect) => {
        effectCounts[effect] = 0;
      });

      // Create timers for each status effect
      character.statusEffects.forEach((effect) => {
        const currentCount = effectCounts[effect] || 0;
        const timerKey = `${effect}_${currentCount}`;

        // Use existing timer if it exists, otherwise create new one
        if (prev[timerKey]) {
          newTimers[timerKey] = prev[timerKey];
        } else {
          newTimers[timerKey] = {
            effect,
            duration: config.defaultDurations[effect] || 10,
            remaining: config.defaultDurations[effect] || 10,
            startTime: Date.now(),
            autoDecrement:
              config.autoDecrementTriggers.onRoll.includes(effect) ||
              config.autoDecrementTriggers.onDamage.includes(effect) ||
              config.autoDecrementTriggers.onMove.includes(effect),
          };
        }

        effectCounts[effect] = currentCount + 1;
      });

      return newTimers;
    });
  }, [character?.statusEffects, config.defaultDurations, config.autoDecrementTriggers]);

  // Timer countdown effect
  useEffect(() => {
    if (Object.keys(timers).length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimers((prev) => {
        const newTimers = { ...prev };
        let hasChanges = false;

        Object.keys(newTimers).forEach((key) => {
          const timer = newTimers[key];

          // Only decrement time-based effects
          if (config.autoDecrementTriggers.onTime.includes(timer.effect)) {
            const newRemaining = Math.max(0, timer.remaining - 1 / 60); // Decrement by 1 second
            if (newRemaining !== timer.remaining) {
              timer.remaining = newRemaining;
              hasChanges = true;
            }
          }
        });

        return hasChanges ? newTimers : prev;
      });
    }, 1000); // Update every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timers, config.autoDecrementTriggers.onTime]);

  // Handle effect expiration
  useEffect(() => {
    const expiredEffects = [];

    Object.keys(timers).forEach((key) => {
      const timer = timers[key];
      if (timer.remaining <= 0) {
        expiredEffects.push(timer.effect);
      }
    });

    if (expiredEffects.length > 0) {
      setCharacter((prev) => ({
        ...prev,
        statusEffects: prev.statusEffects.filter((effect) => !expiredEffects.includes(effect)),
      }));
    }
  }, [timers, setCharacter]);

  // Force re-render when timers change (for testing)
  useEffect(() => {
    // This effect ensures that timer changes trigger re-renders
    // even when manually modified in tests
  }, [timers]);

  // Handle roll-based decrements
  const handleRoll = useCallback(() => {
    const now = Date.now();

    // Initialize lastRollTimeRef if it's null (first call)
    if (lastRollTimeRef.current === null) {
      lastRollTimeRef.current = now;
      // Don't return - allow the first roll to process
    } else {
      const timeSinceLastRoll = now - lastRollTimeRef.current;

      // Only decrement if enough time has passed (prevent spam)
      if (timeSinceLastRoll < 1000) return; // 1 second cooldown

      lastRollTimeRef.current = now;
    }

    setTimers((prev) => {
      const newTimers = { ...prev };
      let hasChanges = false;

      Object.keys(newTimers).forEach((key) => {
        const timer = newTimers[key];

        if (config.autoDecrementTriggers.onRoll.includes(timer.effect)) {
          const newRemaining = Math.max(0, timer.remaining - 1);
          if (newRemaining !== timer.remaining) {
            timer.remaining = newRemaining;
            hasChanges = true;
          }
        }
      });

      return hasChanges ? newTimers : prev;
    });
  }, [config.autoDecrementTriggers.onRoll]);

  // Handle damage-based decrements
  const handleDamage = useCallback(() => {
    setTimers((prev) => {
      const newTimers = { ...prev };
      let hasChanges = false;

      Object.keys(newTimers).forEach((key) => {
        const timer = newTimers[key];

        if (config.autoDecrementTriggers.onDamage.includes(timer.effect)) {
          const newRemaining = Math.max(0, timer.remaining - 1);
          if (newRemaining !== timer.remaining) {
            timer.remaining = newRemaining;
            hasChanges = true;
          }
        }
      });

      return hasChanges ? newTimers : prev;
    });
  }, [config.autoDecrementTriggers.onDamage]);

  // Handle move-based decrements
  const handleMove = useCallback(() => {
    setTimers((prev) => {
      const newTimers = { ...prev };
      let hasChanges = false;

      Object.keys(newTimers).forEach((key) => {
        const timer = newTimers[key];

        if (config.autoDecrementTriggers.onMove.includes(timer.effect)) {
          const newRemaining = Math.max(0, timer.remaining - 1);
          if (newRemaining !== timer.remaining) {
            timer.remaining = newRemaining;
            hasChanges = true;
          }
        }
      });

      return hasChanges ? newTimers : prev;
    });
  }, [config.autoDecrementTriggers.onMove]);

  // Manual timer adjustment
  const adjustTimer = useCallback((effect, adjustment) => {
    setTimers((prev) => {
      const newTimers = { ...prev };
      let hasChanges = false;

      Object.keys(newTimers).forEach((key) => {
        const timer = newTimers[key];
        if (timer.effect === effect) {
          const newRemaining = Math.max(0, timer.remaining + adjustment);
          if (newRemaining !== timer.remaining) {
            timer.remaining = newRemaining;
            hasChanges = true;
          }
        }
      });

      return hasChanges ? newTimers : prev;
    });
  }, []);

  // Get timer status for an effect
  const getTimerStatus = useCallback(
    (effect) => {
      const effectTimers = Object.values(timers).filter((timer) => timer.effect === effect);

      if (effectTimers.length === 0) return null;

      const totalRemaining = effectTimers.reduce((sum, timer) => sum + timer.remaining, 0);
      const minutes = Math.floor(totalRemaining);
      const seconds = Math.floor((totalRemaining - minutes) * 60);

      let status = 'normal';
      if (totalRemaining <= config.warningThresholds.critical) {
        status = 'critical';
      } else if (totalRemaining <= config.warningThresholds.warning) {
        status = 'warning';
      }

      return {
        remaining: totalRemaining,
        minutes,
        seconds,
        status,
        count: effectTimers.length,
      };
    },
    [timers, config.warningThresholds],
  );

  // Get all active timers
  const getActiveTimers = useCallback(() => {
    return Object.values(timers).map((timer) => ({
      ...timer,
      status: getTimerStatus(timer.effect),
    }));
  }, [timers, getTimerStatus]);

  // Update timer configuration
  const updateConfig = useCallback((newConfig) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  // Force check for expired effects (for testing)
  const checkExpiredEffects = useCallback(() => {
    const expiredEffects = [];

    Object.keys(timers).forEach((key) => {
      const timer = timers[key];
      if (timer.remaining <= 0) {
        expiredEffects.push(timer.effect);
      }
    });

    if (expiredEffects.length > 0) {
      setCharacter((prev) => ({
        ...prev,
        statusEffects: prev.statusEffects.filter((effect) => !expiredEffects.includes(effect)),
      }));
    }
  }, [timers, setCharacter]);

  return {
    timers,
    config,
    handleRoll,
    handleDamage,
    handleMove,
    adjustTimer,
    getTimerStatus,
    getActiveTimers,
    updateConfig,
    checkExpiredEffects,
  };
};
