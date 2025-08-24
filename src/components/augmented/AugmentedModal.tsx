import * as Dialog from '@radix-ui/react-dialog';
import React, { ReactNode } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAugmentedUI } from '../../contexts/AugmentedUIContext';
import { useTheme } from '../../contexts/ThemeContext';

interface AugmentedModalProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'holographic' | 'temporal' | 'dimensional';
}

const AugmentedModal: React.FC<AugmentedModalProps> = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  className = '',
  variant = 'default',
}) => {
  const { tokens } = useTheme();
  const { bypassAccessibility } = useAccessibility();
  const { featureFlags } = useAugmentedUI();

  const getModalStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: tokens.glassBg,
      border: `1px solid ${tokens.glassBorder}`,
      borderRadius: tokens.radius,
      backdropFilter: 'blur(16px)',
      boxShadow: tokens.shadowGlass,
      padding: '24px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
    };

    if (!bypassAccessibility) {
      return baseStyles;
    }

    switch (variant) {
      case 'holographic':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(100, 241, 225, 0.4)',
          boxShadow: `0 8px 32px rgba(100, 241, 225, 0.3), 0 0 0 1px rgba(100, 241, 225, 0.1)`,
          ...(featureFlags.holographicModal && {
            animation: 'holographic-scan 3s linear infinite',
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

  const getOverlayStyles = (): React.CSSProperties => ({
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: bypassAccessibility ? 'blur(8px)' : 'blur(4px)',
    position: 'fixed',
    inset: 0,
    animation: bypassAccessibility ? 'fade-in 0.3s ease-out' : 'fade-in 0.2s ease-out',
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="augmented-modal-overlay" style={getOverlayStyles()} />
        <Dialog.Content className={`augmented-modal-content ${className}`} style={getModalStyles()}>
          {title && (
            <Dialog.Title
              style={{
                color: tokens.fg,
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: description ? '8px' : '16px',
              }}
            >
              {title}
            </Dialog.Title>
          )}

          {description && (
            <Dialog.Description
              style={{
                color: tokens.fg,
                opacity: 0.8,
                fontSize: '14px',
                marginBottom: '16px',
              }}
            >
              {description}
            </Dialog.Description>
          )}

          {children}

          <Dialog.Close asChild>
            <button
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: tokens.fg,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AugmentedModal;

