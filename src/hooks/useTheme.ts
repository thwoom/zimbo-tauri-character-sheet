import { useTheme as useThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
  const theme = useThemeContext();

  return {
    ...theme,

    // Theme-specific utilities
    isCosmic: () => theme.theme === 'cosmic',
    isTimeyWimey: () => theme.theme === 'timey-wimey',

    getThemeColor: (colorName: string) => {
      const styles = getComputedStyle(document.documentElement);
      return styles.getPropertyValue(`--color-${colorName}`).trim();
    },

    getThemeSpacing: (size: 'sm' | 'md' | 'lg') => {
      return theme.tokens.spacing[size];
    },

    getThemeRadius: (size?: 'sm' | 'default') => {
      return size === 'sm'
        ? theme.tokens.radius.replace('0.75rem', '0.375rem')
        : theme.tokens.radius;
    },
  };
};

export default useTheme;

