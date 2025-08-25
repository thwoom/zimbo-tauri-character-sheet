import React, { createContext, useContext, useState, useMemo } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({
  children,
  initialAutoXpOnMiss,
  initialShowDiagnostics,
  initialShowHouseRules,
}) => {
  const defaultAutoXpOnMiss = import.meta.env.VITE_AUTO_XP_ON_MISS === 'true';
  const defaultShowDiagnostics = import.meta.env.VITE_SHOW_DIAGNOSTICS === 'true';
  const defaultShowHouseRules = import.meta.env.VITE_SHOW_HOUSE_RULES !== 'false';
  const [autoXpOnMiss, setAutoXpOnMiss] = useState(initialAutoXpOnMiss ?? defaultAutoXpOnMiss);
  const [showDiagnostics, setShowDiagnostics] = useState(
    initialShowDiagnostics ?? defaultShowDiagnostics,
  );
  const [showHouseRules, setShowHouseRules] = useState(
    initialShowHouseRules ?? defaultShowHouseRules,
  );
  const value = useMemo(
    () => ({
      autoXpOnMiss,
      setAutoXpOnMiss,
      showDiagnostics,
      setShowDiagnostics,
      showHouseRules,
      setShowHouseRules,
    }),
    [autoXpOnMiss, showDiagnostics, showHouseRules],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
