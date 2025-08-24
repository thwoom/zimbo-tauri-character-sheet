import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import safeLocalStorage from '../utils/safeLocalStorage.js';

export interface FeatureFlags {
  cyberpunkHudFrame: boolean;
  holographicModal: boolean;
  neonToolbar: boolean;
  tacticalPanelGrid: boolean;
  energyFieldDialog: boolean;
  stealthModeInterface: boolean;
  quantumLoadingStates: boolean;
  dimensionalNavigation: boolean;
  temporalEffects: boolean;
  dimensionalPortals: boolean;
  quantumCircles: boolean;
  temporalPulses: boolean;
}

export interface PerformancePreset {
  name: string;
  flags: Partial<FeatureFlags>;
  description: string;
}

interface AugmentedUIContextType {
  featureFlags: FeatureFlags;
  setFeatureFlag: (flag: keyof FeatureFlags, value: boolean) => void;
  performancePresets: PerformancePreset[];
  applyPreset: (preset: PerformancePreset) => void;
  resetToDefaults: () => void;
}

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  cyberpunkHudFrame: true,
  holographicModal: true,
  neonToolbar: true,
  tacticalPanelGrid: true,
  energyFieldDialog: false,
  stealthModeInterface: false,
  quantumLoadingStates: false,
  dimensionalNavigation: true,
  temporalEffects: true,
  dimensionalPortals: false,
  quantumCircles: false,
  temporalPulses: false,
};

const PERFORMANCE_PRESETS: PerformancePreset[] = [
  {
    name: 'Low',
    description: 'Minimal effects for performance',
    flags: {
      cyberpunkHudFrame: false,
      holographicModal: false,
      neonToolbar: false,
      tacticalPanelGrid: false,
      energyFieldDialog: false,
      stealthModeInterface: false,
      quantumLoadingStates: false,
      dimensionalNavigation: false,
      temporalEffects: false,
      dimensionalPortals: false,
      quantumCircles: false,
      temporalPulses: false,
    },
  },
  {
    name: 'Medium',
    description: 'Balanced effects and performance',
    flags: {
      cyberpunkHudFrame: true,
      holographicModal: true,
      neonToolbar: false,
      tacticalPanelGrid: true,
      energyFieldDialog: false,
      stealthModeInterface: false,
      quantumLoadingStates: true,
      dimensionalNavigation: false,
      temporalEffects: false,
      dimensionalPortals: false,
      quantumCircles: false,
      temporalPulses: false,
    },
  },
  {
    name: 'High',
    description: 'Maximum visual effects',
    flags: {
      cyberpunkHudFrame: true,
      holographicModal: true,
      neonToolbar: true,
      tacticalPanelGrid: true,
      energyFieldDialog: true,
      stealthModeInterface: true,
      quantumLoadingStates: true,
      dimensionalNavigation: true,
      temporalEffects: true,
      dimensionalPortals: true,
      quantumCircles: true,
      temporalPulses: true,
    },
  },
];

const AugmentedUIContext = createContext<AugmentedUIContextType | undefined>(undefined);

interface AugmentedUIProviderProps {
  children: ReactNode;
}

export const AugmentedUIProvider = ({ children }: AugmentedUIProviderProps) => {
  const [featureFlags, setFeatureFlagsState] = useState<FeatureFlags>(() => {
    const saved = safeLocalStorage.getItem('augmented-ui-flags');
    let initialFlags = DEFAULT_FEATURE_FLAGS;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        initialFlags = { ...DEFAULT_FEATURE_FLAGS, ...parsed };
        console.log('AugmentedUIProvider: Loaded saved flags:', parsed);
      } catch (error) {
        console.warn('Failed to parse saved feature flags, using defaults');
      }
    } else {
      console.log('AugmentedUIProvider: No saved flags found, using defaults');
    }

    console.log('AugmentedUIProvider: Initializing with featureFlags:', initialFlags);
    return initialFlags;
  });

  const setFeatureFlag = (flag: keyof FeatureFlags, value: boolean) => {
    console.log('AugmentedUIProvider: Setting feature flag:', flag, 'to:', value);
    const newFlags = { ...featureFlags, [flag]: value };
    setFeatureFlagsState(newFlags);
    safeLocalStorage.setItem('augmented-ui-flags', JSON.stringify(newFlags));
  };

  const applyPreset = (preset: PerformancePreset) => {
    console.log('AugmentedUIProvider: Applying preset:', preset.name);
    const newFlags = { ...DEFAULT_FEATURE_FLAGS, ...preset.flags };
    setFeatureFlagsState(newFlags);
    safeLocalStorage.setItem('augmented-ui-flags', JSON.stringify(newFlags));
  };

  const resetToDefaults = () => {
    console.log('AugmentedUIProvider: Resetting to defaults');
    setFeatureFlagsState(DEFAULT_FEATURE_FLAGS);
    safeLocalStorage.setItem('augmented-ui-flags', JSON.stringify(DEFAULT_FEATURE_FLAGS));
  };

  // Load saved flags on mount
  useEffect(() => {
    const saved = safeLocalStorage.getItem('augmented-ui-flags');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFeatureFlagsState({ ...DEFAULT_FEATURE_FLAGS, ...parsed });
        console.log('AugmentedUIProvider: Loaded saved flags on mount:', parsed);
      } catch (error) {
        console.warn('Failed to parse saved feature flags, using defaults');
      }
    }
  }, []);

  const value: AugmentedUIContextType = {
    featureFlags,
    setFeatureFlag,
    performancePresets: PERFORMANCE_PRESETS,
    applyPreset,
    resetToDefaults,
  };

  console.log('AugmentedUIProvider: Rendering with value:', value);

  return <AugmentedUIContext.Provider value={value}>{children}</AugmentedUIContext.Provider>;
};

export const useAugmentedUI = (): AugmentedUIContextType => {
  const context = useContext(AugmentedUIContext);
  if (context === undefined) {
    throw new Error('useAugmentedUI must be used within an AugmentedUIProvider');
  }
  return context;
};

export default AugmentedUIContext;
