import React, { ReactNode } from 'react';
import { useAugmentedUI } from '../../hooks/useAugmentedUI';

interface AugmentedWrapperProps {
  children: ReactNode;
  className?: string;
  variant?:
    | 'cyberpunk'
    | 'holographic'
    | 'temporal'
    | 'dimensional'
    | 'quantum'
    | 'stealth'
    | 'neon'
    | 'tactical';
  intensity?: 'low' | 'medium' | 'high';
  disabled?: boolean;
}

const AugmentedWrapper: React.FC<AugmentedWrapperProps> = ({
  children,
  className = '',
  variant = 'cyberpunk',
  intensity = 'medium',
  disabled = false,
}) => {
  const { isEffectEnabled, shouldApplyEffects } = useAugmentedUI();

  // Map variants to feature flags
  const variantToFlag = {
    cyberpunk: 'cyberpunkHudFrame',
    holographic: 'holographicModal',
    temporal: 'temporalEffects',
    dimensional: 'dimensionalNavigation',
    quantum: 'quantumLoadingStates',
    stealth: 'stealthModeInterface',
    neon: 'neonToolbar',
    tactical: 'tacticalPanelGrid',
  } as const;

  // Debug logging
  console.log(`AugmentedWrapper [${variant}]:`, {
    shouldApplyEffects: shouldApplyEffects(),
    isEffectEnabled: isEffectEnabled(variantToFlag[variant]),
    disabled,
    variant,
    intensity,
  });

  // Don't apply effects if disabled or accessibility is not bypassed
  if (disabled || !shouldApplyEffects()) {
    console.log(
      `AugmentedWrapper [${variant}]: Skipping effects - disabled: ${disabled}, shouldApply: ${shouldApplyEffects()}`,
    );
    return <div className={className}>{children}</div>;
  }

  const featureFlag = variantToFlag[variant];
  const isEnabled = isEffectEnabled(featureFlag);

  if (!isEnabled) {
    console.log(`AugmentedWrapper [${variant}]: Feature flag ${featureFlag} is disabled`);
    return <div className={className}>{children}</div>;
  }

  // Map variants to augmented-ui mixins and CSS classes
  const variantToAugmentedUI = {
    cyberpunk: {
      'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip both',
      cssClass: 'cyberpunk-hud-frame',
    },
    holographic: {
      'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip both',
      cssClass: 'holographic-modal',
    },
    temporal: {
      'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip both',
      cssClass: 'temporal-effects',
    },
    dimensional: {
      'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip both',
      cssClass: 'dimensional-navigation',
    },
    quantum: {
      'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip both',
      cssClass: 'quantum-loading',
    },
    stealth: {
      'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip both',
      cssClass: 'stealth-mode-interface',
    },
    neon: {
      'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip both',
      cssClass: 'neon-toolbar',
    },
    tactical: {
      'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip both',
      cssClass: 'tactical-panel-grid',
    },
  };

  const augmentedUI = variantToAugmentedUI[variant];
  const intensityClass = `augmented-performance-${intensity}`;

  console.log(`AugmentedWrapper [${variant}]: Applying augmented-ui with:`, {
    augmentedUI,
    intensityClass,
    fullClasses: `augmented-effect augmented-gpu ${augmentedUI.cssClass} ${intensityClass} ${className}`,
  });

  return (
    <div
      className={`augmented-effect augmented-gpu ${augmentedUI.cssClass} ${intensityClass} ${className}`}
      data-augmented-ui={augmentedUI['data-augmented-ui']}
    >
      {children}
    </div>
  );
};

export default AugmentedWrapper;
