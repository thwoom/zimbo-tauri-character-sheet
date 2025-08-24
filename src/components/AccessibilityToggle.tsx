import React from 'react';
import { FaUniversalAccess } from 'react-icons/fa6';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTheme } from '../contexts/ThemeContext';
import glassStyles from '../styles/glassmorphic.module.css';

interface AccessibilityToggleProps {
  className?: string;
  showLabel?: boolean;
  iconOnly?: boolean;
}

const AccessibilityToggle: React.FC<AccessibilityToggleProps> = ({
  className = '',
  showLabel = true,
  iconOnly = false,
}) => {
  const { bypassAccessibility, setBypassAccessibility, accessibilityIndicator } =
    useAccessibility();
  const { tokens } = useTheme();

  // Debug logging
  console.log('AccessibilityToggle: Rendering with bypassAccessibility:', bypassAccessibility);
  console.log('AccessibilityToggle: tokens:', tokens);

  const handleToggle = () => {
    try {
      console.log(
        'AccessibilityToggle: Toggling accessibility bypass from:',
        bypassAccessibility,
        'to:',
        !bypassAccessibility,
      );
      setBypassAccessibility(!bypassAccessibility);
      console.log('AccessibilityToggle: Toggle completed successfully');
    } catch (error) {
      console.error('AccessibilityToggle: Error toggling accessibility bypass:', error);
    }
  };

  if (iconOnly) {
    return (
      <button
        className={`${glassStyles.glassButton} ${glassStyles.glassButtonIcon} ${className}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleToggle();
        }}
        aria-label={
          bypassAccessibility ? 'Disable accessibility bypass' : 'Enable accessibility bypass'
        }
        title={bypassAccessibility ? 'Disable accessibility bypass' : 'Enable accessibility bypass'}
        type="button"
      >
        <FaUniversalAccess />
      </button>
    );
  }

  return (
    <div
      className={`accessibility-toggle ${className}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999, // Increased z-index to ensure visibility
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: bypassAccessibility ? 'rgba(184, 79, 94, 0.9)' : 'rgba(74, 179, 129, 0.9)', // Made more opaque
        border: `2px solid ${bypassAccessibility ? '#b84f5e' : '#4ab381'}`, // Made border thicker
        borderRadius: '8px',
        backdropFilter: 'blur(12px)',
        boxShadow: bypassAccessibility
          ? '0 0 20px rgba(184, 79, 94, 0.8)' // Made shadow more visible
          : '0 0 20px rgba(74, 179, 129, 0.8)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        userSelect: 'none',
        transform: accessibilityIndicator ? 'scale(1.1)' : 'scale(1)',
        // Added more visible styling for debugging
        minWidth: '140px',
        minHeight: '40px',
        // Added a bright outline to make it more visible
        outline: '2px solid #ffffff',
        outlineOffset: '2px',
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('AccessibilityToggle: Click event fired');
        handleToggle();
      }}
      onMouseDown={(e) => {
        console.log('AccessibilityToggle: Mouse down event fired');
      }}
      title={bypassAccessibility ? 'Disable accessibility bypass' : 'Enable accessibility bypass'}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: bypassAccessibility ? '#b84f5e' : '#4ab381',
          border: '2px solid #fff',
          boxShadow: bypassAccessibility
            ? '0 0 8px rgba(184, 79, 94, 0.6)'
            : '0 0 8px rgba(74, 179, 129, 0.6)',
          transition: 'all 0.3s ease',
        }}
      />
      {showLabel && (
        <span
          style={{
            color: tokens.fg || '#ffffff', // Fallback color
            fontSize: '12px',
            fontWeight: 600, // Made font weight bolder
            whiteSpace: 'nowrap',
            textShadow: '0 0 4px rgba(0,0,0,0.8)', // Added text shadow for better visibility
          }}
        >
          {bypassAccessibility ? 'A11y Bypassed' : 'A11y Enabled'}
        </span>
      )}
    </div>
  );
};

export default AccessibilityToggle;
