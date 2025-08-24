import { useAccessibility as useAccessibilityContext } from '../contexts/AccessibilityContext';

export const useAccessibility = () => {
  const accessibility = useAccessibilityContext();

  return {
    ...accessibility,

    // Accessibility utilities
    shouldReduceMotion: () => {
      if (accessibility.bypassAccessibility) return false;

      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
      return false;
    },

    shouldReduceData: () => {
      if (accessibility.bypassAccessibility) return false;

      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-reduced-data: reduce)').matches;
      }
      return false;
    },

    getAnimationDuration: (baseDuration: number) => {
      if (accessibility.bypassAccessibility) return baseDuration;

      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return prefersReducedMotion ? 0 : baseDuration;
      }
      return baseDuration;
    },

    getEffectOpacity: (baseOpacity: number) => {
      if (accessibility.bypassAccessibility) return baseOpacity;

      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return prefersReducedMotion ? baseOpacity * 0.3 : baseOpacity;
      }
      return baseOpacity;
    },
  };
};

export default useAccessibility;

