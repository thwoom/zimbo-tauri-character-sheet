import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, DEFAULT_THEME } from './theme.js';
import safeLocalStorage from '../utils/safeLocalStorage.js';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => safeLocalStorage.getItem('theme', DEFAULT_THEME));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    safeLocalStorage.setItem('theme', theme);
  }, [theme]);

  const value = { theme, setTheme, themes: THEMES };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
