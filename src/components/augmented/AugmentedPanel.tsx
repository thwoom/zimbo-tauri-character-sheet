import React, { ReactNode } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAugmentedUI } from '../../contexts/AugmentedUIContext';
import { useTheme } from '../../contexts/ThemeContext';

export type PanelVariant =
  | 'default'
  | 'danger'
  | 'success'
  | 'cyberpunk'
  | 'holographic'
  | 'neon'
  | 'temporal'
  | 'dimensional';

interface AugmentedPanelProps {
  children: ReactNode;
  variant?: PanelVariant;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}

const AugmentedPanel: React.FC<AugmentedPanelProps> = ({
  children,
  variant = 'default',
  className = '',
  style = {},
  onClick,
  disabled = false,
}) => {
  const { tokens } = useTheme();
  const { bypassAccessibility } = useAccessibility();
  const { featureFlags } = useAugmentedUI();

  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: tokens.glassBg,
      border: `1px solid ${tokens.glassBorder}`,
      borderRadius: tokens.radius,
      backdropFilter: 'blur(12px)',
      boxShadow: tokens.shadowGlass,
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    };

    if (disabled) {
      return {
        ...baseStyles,
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      };
    }

    if (onClick) {
      baseStyles.cursor = 'pointer';
    }

    // Apply dramatic effects only when accessibility is bypassed
    if (!bypassAccessibility) {
      return baseStyles;
    }

    switch (variant) {
      case 'danger':
        return {
          ...baseStyles,
          borderColor: '#b84f5e',
          boxShadow: '0 8px 32px rgba(184, 79, 94, 0.4), 0 0 0 1px rgba(184, 79, 94, 0.2)',
          ...(featureFlags.energyFieldDialog && {
            '--tw-shadow': '0 0 20px rgba(184, 79, 94, 0.6)',
          }),
        };

      case 'success':
        return {
          ...baseStyles,
          borderColor: '#4ab381',
          boxShadow: '0 8px 32px rgba(74, 179, 129, 0.4), 0 0 0 1px rgba(74, 179, 129, 0.2)',
          ...(featureFlags.energyFieldDialog && {
            '--tw-shadow': '0 0 20px rgba(74, 179, 129, 0.6)',
          }),
        };

      case 'cyberpunk':
        return {
          ...baseStyles,
          borderColor: tokens.colorNeon,
          boxShadow: `0 8px 32px rgba(100, 241, 225, 0.4), 0 0 0 1px rgba(100, 241, 225, 0.2)`,
          ...(featureFlags.cyberpunkHudFrame && {
            '--tw-shadow': `0 0 20px rgba(100, 241, 225, 0.6)`,
            animation: 'cyberpunk-pulse 2s ease-in-out infinite',
          }),
        };

      case 'holographic':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(100, 241, 225, 0.4)',
          boxShadow: `0 8px 32px rgba(100, 241, 225, 0.3), 0 0 0 1px rgba(100, 241, 225, 0.1)`,
          ...(featureFlags.holographicModal && {
            '--tw-shadow': `0 0 20px rgba(100, 241, 225, 0.5)`,
            animation: 'holographic-scan 3s linear infinite',
          }),
        };

      case 'neon':
        return {
          ...baseStyles,
          borderColor: tokens.colorNeon,
          boxShadow: `0 0 15px ${tokens.colorNeon}`,
          ...(featureFlags.neonToolbar && {
            animation: 'neon-flicker 1.5s ease-in-out infinite',
          }),
        };

      case 'temporal':
        return {
          ...baseStyles,
          borderColor: '#8b5cf6',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.2)',
          ...(featureFlags.temporalEffects && {
            animation: 'temporal-pulse 4s ease-in-out infinite',
          }),
        };

      case 'dimensional':
        return {
          ...baseStyles,
          borderColor: '#06b6d4',
          boxShadow: '0 8px 32px rgba(6, 182, 212, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.2)',
          ...(featureFlags.dimensionalPortals && {
            animation: 'dimensional-shift 5s ease-in-out infinite',
          }),
        };

      default:
        return baseStyles;
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`augmented-panel augmented-panel-${variant} ${className}`}
      style={{
        ...getVariantStyles(),
        ...style,
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default AugmentedPanel;

