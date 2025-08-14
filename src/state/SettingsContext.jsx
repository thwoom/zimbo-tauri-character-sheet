import React, { createContext, useContext, useState, useMemo } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children, initialAutoXpOnMiss }) => {
  const defaultAutoXpOnMiss = import.meta.env.VITE_AUTO_XP_ON_MISS === 'true';
  const [autoXpOnMiss, setAutoXpOnMiss] = useState(initialAutoXpOnMiss ?? defaultAutoXpOnMiss);
  const value = useMemo(() => ({ autoXpOnMiss, setAutoXpOnMiss }), [autoXpOnMiss]);
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
