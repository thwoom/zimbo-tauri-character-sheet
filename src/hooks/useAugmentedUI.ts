import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAugmentedUI as useAugmentedUIContext } from '../contexts/AugmentedUIContext';
import { useTheme } from '../contexts/ThemeContext';

export const useAugmentedUI = () => {
  const augmentedUI = useAugmentedUIContext();
  const accessibility = useAccessibility();
  const theme = useTheme();

  return {
    ...augmentedUI,
    ...accessibility,
    ...theme,

    // Convenience methods
    isEffectEnabled: (effectName: keyof typeof augmentedUI.featureFlags) => {
      return accessibility.bypassAccessibility && augmentedUI.featureFlags[effectName];
    },

    getThemeVariant: (baseVariant: string) => {
      if (theme.theme === 'timey-wimey') {
        return `${baseVariant}-temporal`;
      }
      return `${baseVariant}-cosmic`;
    },

    shouldApplyEffects: () => {
      return accessibility.bypassAccessibility;
    },

    getEffectIntensity: () => {
      if (!accessibility.bypassAccessibility) return 0;

      const enabledEffects = Object.values(augmentedUI.featureFlags).filter(Boolean).length;
      return Math.min(enabledEffects / 12, 1); // Normalize to 0-1
    },
  };
};

export default useAugmentedUI;

