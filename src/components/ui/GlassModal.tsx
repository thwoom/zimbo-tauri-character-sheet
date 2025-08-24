import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { backdropVariants, modalVariants } from '../../motion/variants';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = '900px',
  className = '',
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          borderColor: 'var(--color-success)',
          shadowColor: 'rgba(74, 179, 129, 0.3)',
          iconBg: 'rgba(74, 179, 129, 0.2)',
          iconColor: 'var(--color-success)',
        };
      case 'warning':
        return {
          borderColor: 'var(--color-warning)',
          shadowColor: 'rgba(255, 193, 7, 0.3)',
          iconBg: 'rgba(255, 193, 7, 0.2)',
          iconColor: 'var(--color-warning)',
        };
      case 'danger':
        return {
          borderColor: 'var(--color-danger)',
          shadowColor: 'rgba(220, 53, 69, 0.3)',
          iconBg: 'rgba(220, 53, 69, 0.2)',
          iconColor: 'var(--color-danger)',
        };
      default:
        return {
          borderColor: 'var(--color-neon)',
          shadowColor: 'var(--shadow-neon)',
          iconBg: 'rgba(100, 241, 225, 0.2)',
          iconColor: 'var(--color-neon)',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(12px)',
              zIndex: 99998,
              border: 'none',
              cursor: 'pointer',
            }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            aria-label="Close modal backdrop"
          />

          {/* Modal Container */}
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px',
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className={className}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth,
                maxHeight: '90vh',
                backgroundColor: 'rgba(2, 30, 38, 0.8)',
                border: `1px solid ${variantStyles.borderColor}`,
                borderRadius: 'var(--radius)',
                boxShadow: `0 4px 16px rgba(0, 0, 0, 0.3), 0 0 20px ${variantStyles.shadowColor}`,
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              {(title || icon) && (
                <div
                  style={{
                    padding: '24px 32px',
                    borderBottom: `1px solid ${variantStyles.borderColor}`,
                    background:
                      'linear-gradient(to right, rgba(100, 241, 225, 0.1), rgba(100, 241, 225, 0.05))',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {icon && (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: variantStyles.iconBg,
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${variantStyles.borderColor}`,
                        }}
                      >
                        <span style={{ color: variantStyles.iconColor, fontSize: '18px' }}>
                          {icon}
                        </span>
                      </div>
                    )}
                    {title && (
                      <h2
                        style={{
                          fontSize: '20px',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 'bold',
                          color: '#64f1e1',
                          letterSpacing: '0.05em',
                          margin: 0,
                          textShadow: '0 0 10px rgba(100, 241, 225, 0.5)',
                        }}
                      >
                        {title}
                      </h2>
                    )}
                    <div
                      style={{
                        flex: 1,
                        height: '1px',
                        background: `linear-gradient(to right, ${variantStyles.borderColor}, transparent)`,
                        marginLeft: '16px',
                      }}
                    />
                  </div>
                  {subtitle && (
                    <p
                      style={{
                        color: '#d0d7e2',
                        fontSize: '14px',
                        marginTop: '8px',
                        marginLeft: icon ? '44px' : '0',
                        marginBottom: 0,
                      }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                style={{
                  padding: '32px',
                  maxHeight: '70vh',
                  overflowY: 'auto',
                }}
              >
                {children}
              </div>

              {/* Close Button */}
              <button
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-neutral)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--hud-transition)',
                }}
                onClick={onClose}
                aria-label="Close modal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = 'var(--color-text)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--color-neutral)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                ×
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlassModal;
