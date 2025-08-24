import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'compact' | 'full';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  showLabel = true,
  variant = 'full',
}) => {
  const { theme, setTheme, themes } = useTheme();
  const { tokens } = useTheme();
  const { bypassAccessibility } = useAccessibility();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as 'cosmic' | 'timey-wimey');
  };

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'cosmic':
        return '🌌';
      case 'timey-wimey':
        return '⏰';
      default:
        return '🎨';
    }
  };

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case 'cosmic':
        return 'Cosmic';
      case 'timey-wimey':
        return 'Timey Wimey';
      default:
        return themeName;
    }
  };

  if (variant === 'compact') {
    return (
      <div
        className={`theme-switcher-compact ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {themes.map((themeName) => (
          <button
            key={themeName}
            onClick={() => handleThemeChange(themeName)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: `2px solid ${theme === themeName ? tokens.accent : 'transparent'}`,
              backgroundColor:
                theme === themeName ? 'rgba(95, 209, 193, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: tokens.fg,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              boxShadow: theme === themeName ? `0 0 8px ${tokens.accent}` : 'none',
            }}
            title={`Switch to ${getThemeLabel(themeName)} theme`}
          >
            {getThemeIcon(themeName)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`theme-switcher ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        border: `1px solid ${tokens.accent}`,
        borderRadius: '10px',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 12px ${tokens.accent}20`,
        minWidth: '200px',
      }}
    >
      {showLabel && (
        <div
          style={{
            color: tokens.fg,
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          Theme
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {themes.map((themeName) => (
          <button
            key={themeName}
            onClick={() => handleThemeChange(themeName)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme === themeName ? tokens.accent : 'transparent'}`,
              backgroundColor:
                theme === themeName ? 'rgba(95, 209, 193, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: tokens.fg,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              backdropFilter: 'blur(8px)',
              boxShadow: theme === themeName ? `0 0 8px ${tokens.accent}40` : 'none',
            }}
          >
            <span style={{ fontSize: '16px' }}>{getThemeIcon(themeName)}</span>
            <span>{getThemeLabel(themeName)}</span>
            {theme === themeName && (
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '12px',
                  color: tokens.accent,
                }}
              >
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {!bypassAccessibility && (
        <div
          style={{
            fontSize: '11px',
            color: tokens.fg,
            opacity: 0.7,
            marginTop: '8px',
            padding: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          💡 Accessibility mode active - some effects may be reduced
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;

