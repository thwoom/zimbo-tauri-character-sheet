import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import safeLocalStorage from '../utils/safeLocalStorage.js';

interface AccessibilityContextType {
  bypassAccessibility: boolean;
  setBypassAccessibility: (bypass: boolean) => void;
  isAccessibilityBypassed: () => boolean;
  accessibilityIndicator: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [bypassAccessibility, setBypassAccessibilityState] = useState(() => {
    const initialValue = safeLocalStorage.getItem('bypassAccessibility', 'false') === 'true';
    console.log('AccessibilityProvider: Initializing with bypassAccessibility:', initialValue);
    return initialValue;
  });
  const [accessibilityIndicator, setAccessibilityIndicator] = useState(false);

  const setBypassAccessibility = (bypass: boolean) => {
    console.log('AccessibilityProvider: Setting bypassAccessibility to:', bypass);
    console.log('AccessibilityProvider: Previous state was:', bypassAccessibility);
    setBypassAccessibilityState(bypass);
    safeLocalStorage.setItem('bypassAccessibility', bypass.toString());
    console.log('AccessibilityProvider: State updated and saved to localStorage');

    // Show indicator briefly when bypassing
    if (bypass) {
      setAccessibilityIndicator(true);
      setTimeout(() => setAccessibilityIndicator(false), 2000);
    }
  };

  const isAccessibilityBypassed = () => {
    return bypassAccessibility;
  };

  // Check system preferences for motion reduction
  useEffect(() => {
    const checkSystemPreferences = () => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;

        // Only bypass if user hasn't explicitly set it
        if (!bypassAccessibility && (prefersReducedMotion || prefersReducedData)) {
          console.log('System preferences detected: reduced motion/data');
        }
      }
    };

    checkSystemPreferences();
  }, [bypassAccessibility]);

  // Debug effect to track state changes
  useEffect(() => {
    console.log(
      'AccessibilityProvider: State changed to bypassAccessibility:',
      bypassAccessibility,
    );
  }, [bypassAccessibility]);

  const value: AccessibilityContextType = {
    bypassAccessibility,
    setBypassAccessibility,
    isAccessibilityBypassed,
    accessibilityIndicator,
  };

  console.log('AccessibilityProvider: Rendering with value:', value);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
