import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, DEFAULT_THEME } from './theme.js';
import safeLocalStorage from '../utils/safeLocalStorage.js';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => safeLocalStorage.getItem('theme', DEFAULT_THEME));
  const [tokens, setTokens] = useState({});

  useEffect(() => {
    if (typeof document === 'undefined' || !document.documentElement) return;

    document.documentElement.setAttribute('data-theme', theme);

    safeLocalStorage.setItem('theme', theme);

    const styles = getComputedStyle(document.documentElement);
    setTokens({
      fg: styles.getPropertyValue('--fg').trim(),
      bg: styles.getPropertyValue('--bg').trim(),
      accent: styles.getPropertyValue('--accent').trim(),
      radius: styles.getPropertyValue('--radius').trim(),
      shadow: styles.getPropertyValue('--shadow').trim(),
      spacing: {
        sm: styles.getPropertyValue('--spacing-sm').trim(),
        md: styles.getPropertyValue('--spacing-md').trim(),
        lg: styles.getPropertyValue('--spacing-lg').trim(),
      },
    });
  }, [theme]);

  const value = { theme, setTheme, themes: THEMES, tokens };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
