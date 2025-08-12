import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, DEFAULT_THEME } from './theme.js';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || DEFAULT_THEME);

  useEffect(() => {
    const allVars = new Set();
    Object.values(THEMES).forEach((vars) => {
      Object.keys(vars).forEach((key) => allVars.add(key));
    });

    allVars.forEach((key) => {
      const value = THEMES[theme][key];
      if (value !== undefined) {
        document.documentElement.style.setProperty(key, value);
      }
    });

    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = { theme, setTheme, themes: Object.keys(THEMES) };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
