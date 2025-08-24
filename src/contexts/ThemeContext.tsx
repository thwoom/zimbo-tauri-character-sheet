import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import safeLocalStorage from '../utils/safeLocalStorage.js';

export type ThemeType = 'cosmic' | 'timey-wimey';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themes: ThemeType[];
  tokens: ThemeTokens;
}

interface ThemeTokens {
  fg: string;
  bg: string;
  accent: string;
  radius: string;
  shadow: string;
  glassBg: string;
  glassBorder: string;
  shadowGlass: string;
  colorNeon: string;
  shadowNeon: string;
  spacing: {
    sm: string;
    md: string;
    lg: string;
  };
}

const THEMES: ThemeType[] = ['cosmic', 'timey-wimey'];
const DEFAULT_THEME: ThemeType = 'cosmic';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = safeLocalStorage.getItem('augmented-theme', DEFAULT_THEME);
    return THEMES.includes(savedTheme as ThemeType) ? (savedTheme as ThemeType) : DEFAULT_THEME;
  });
  const [tokens, setTokens] = useState<ThemeTokens>({
    fg: '',
    bg: '',
    accent: '',
    radius: '',
    shadow: '',
    glassBg: '',
    glassBorder: '',
    shadowGlass: '',
    colorNeon: '',
    shadowNeon: '',
    spacing: { sm: '', md: '', lg: '' },
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    safeLocalStorage.setItem('augmented-theme', newTheme);
  };

  useEffect(() => {
    if (typeof document === 'undefined' || !document.documentElement) return;

    console.log('ThemeProvider: Setting theme to', theme);
    document.documentElement.setAttribute('data-augmented-theme', theme);

    // Also set the legacy theme attribute for backward compatibility
    if (theme === 'cosmic') {
      document.documentElement.setAttribute('data-theme', 'cosmic-v2');
    } else {
      document.documentElement.setAttribute('data-theme', 'cosmic-v2'); // Fallback
    }

    safeLocalStorage.setItem('augmented-theme', theme);

    try {
      const styles = getComputedStyle(document.documentElement);
      setTokens({
        fg: styles.getPropertyValue('--fg').trim() || '#d0d7e2',
        bg: styles.getPropertyValue('--bg').trim() || '#0b0d17',
        accent: styles.getPropertyValue('--accent').trim() || '#5fd1c1',
        radius: styles.getPropertyValue('--radius').trim() || '0.75rem',
        shadow: styles.getPropertyValue('--shadow').trim() || '0 0 10px rgba(0, 0, 0, 0.3)',
        glassBg: styles.getPropertyValue('--glass-bg').trim() || 'rgba(255, 255, 255, 0.03)',
        glassBorder: styles.getPropertyValue('--glass-border').trim() || 'rgba(95, 209, 193, 0.2)',
        shadowGlass:
          styles.getPropertyValue('--shadow-glass').trim() || '0 8px 32px rgba(0, 0, 0, 0.4)',
        colorNeon: styles.getPropertyValue('--color-neon').trim() || '#64f1e1',
        shadowNeon: styles.getPropertyValue('--shadow-neon').trim() || '0 0 10px #64f1e1',
        spacing: {
          sm: styles.getPropertyValue('--spacing-sm').trim() || '0.5rem',
          md: styles.getPropertyValue('--spacing-md').trim() || '1rem',
          lg: styles.getPropertyValue('--spacing-lg').trim() || '1.5rem',
        },
      });
    } catch (error) {
      console.log('ThemeProvider: Could not set tokens in test environment');
      setTokens({
        fg: '#d0d7e2',
        bg: '#0b0d17',
        accent: '#5fd1c1',
        radius: '0.75rem',
        shadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        glassBg: 'rgba(255, 255, 255, 0.03)',
        glassBorder: 'rgba(95, 209, 193, 0.2)',
        shadowGlass: '0 8px 32px rgba(0, 0, 0, 0.4)',
        colorNeon: '#64f1e1',
        shadowNeon: '0 0 10px #64f1e1',
        spacing: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
      });
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    themes: THEMES,
    tokens,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;

