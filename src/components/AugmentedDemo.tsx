import React from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useAugmentedUI } from '../hooks/useAugmentedUI';
import { useTheme } from '../hooks/useTheme';

const AugmentedDemo: React.FC = () => {
  const { bypassAccessibility, setBypassAccessibility } = useAccessibility();
  const { theme, setTheme } = useTheme();
  const { featureFlags, setFeatureFlag } = useAugmentedUI();

  const activeEffectsCount = Object.values(featureFlags).filter(Boolean).length;

  const handleToggleAccessibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('AugmentedDemo: Toggling accessibility bypass');
    setBypassAccessibility(!bypassAccessibility);
  };

  const handleToggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('AugmentedDemo: Switching theme');
    setTheme(theme === 'cosmic' ? 'timey-wimey' : 'cosmic');
  };

  const handleToggleEffect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('AugmentedDemo: Toggling cyberpunk effect');
    setFeatureFlag('cyberpunkHudFrame', !featureFlags.cyberpunkHudFrame);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: bypassAccessibility
          ? 'rgba(100, 241, 225, 0.1)'
          : 'rgba(255, 255, 255, 0.1)',
        border: bypassAccessibility
          ? '2px solid rgba(100, 241, 225, 0.6)'
          : '2px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        color: bypassAccessibility ? '#64f1e1' : '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
        textShadow: bypassAccessibility ? '0 0 10px rgba(100, 241, 225, 0.8)' : 'none',
        animation: bypassAccessibility ? 'pulse 2s ease-in-out infinite' : 'none',
        minWidth: '200px',
      }}
    >
      <div style={{ marginBottom: '12px', textAlign: 'center' }}>
        <strong>Augmented-UI Debug</strong>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span>Accessibility: </span>
        <span style={{ color: bypassAccessibility ? '#64f1e1' : '#ff6b6b' }}>
          {bypassAccessibility ? 'BYPASSED' : 'ENFORCED'}
        </span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span>Theme: </span>
        <span style={{ color: '#64f1e1' }}>{theme}</span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span>Active Effects: </span>
        <span style={{ color: '#64f1e1' }}>{activeEffectsCount}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleToggleAccessibility}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: bypassAccessibility
              ? 'rgba(100, 241, 225, 0.2)'
              : 'rgba(255, 255, 255, 0.1)',
            color: bypassAccessibility ? '#64f1e1' : '#ffffff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {bypassAccessibility ? '🔒 Disable Effects' : '🚀 Enable Effects'}
        </button>

        <button
          onClick={handleToggleTheme}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            color: '#8b5cf6',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          🔄 Switch Theme
        </button>

        <button
          onClick={handleToggleEffect}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: featureFlags.cyberpunkHudFrame
              ? 'rgba(100, 241, 225, 0.2)'
              : 'rgba(255, 255, 255, 0.1)',
            color: featureFlags.cyberpunkHudFrame ? '#64f1e1' : '#ffffff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {featureFlags.cyberpunkHudFrame ? '🔴 Disable Cyberpunk' : '🟢 Enable Cyberpunk'}
        </button>
      </div>

      {/* Simple Augmented-UI Test */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div style={{ fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>
          <strong>Augmented-UI Test</strong>
        </div>

        {/* Test with basic augmented-ui */}
        <div
          data-augmented-ui="tl-clip tr-clip br-clip bl-clip both"
          style={{
            padding: '8px',
            backgroundColor: 'rgba(100, 241, 225, 0.1)',
            border: '2px solid rgba(100, 241, 225, 0.5)',
            color: '#64f1e1',
            fontSize: '11px',
            textAlign: 'center',
          }}
        >
          Basic Test Panel
        </div>
      </div>
    </div>
  );
};

export default AugmentedDemo;
