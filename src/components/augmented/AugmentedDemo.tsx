import React, { useState } from 'react';
import { useAugmentedUI } from '../../hooks/useAugmentedUI';
import AugmentedModal from './AugmentedModal';
import AugmentedPanel from './AugmentedPanel';

const AugmentedDemo: React.FC = () => {
  const { isEffectEnabled, shouldApplyEffects, getEffectIntensity } = useAugmentedUI();
  const [showModal, setShowModal] = useState(false);

  const panelVariants = [
    'default',
    'danger',
    'success',
    'cyberpunk',
    'holographic',
    'neon',
    'temporal',
    'dimensional',
  ] as const;

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ color: '#d0d7e2', marginBottom: '20px' }}>Augmented-UI Demo</h2>

      {/* Status Information */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(100, 241, 225, 0.3)',
        }}
      >
        <p style={{ color: '#d0d7e2', margin: '0 0 8px 0' }}>
          <strong>Accessibility Bypassed:</strong> {shouldApplyEffects() ? 'Yes' : 'No'}
        </p>
        <p style={{ color: '#d0d7e2', margin: '0 0 8px 0' }}>
          <strong>Effect Intensity:</strong> {Math.round(getEffectIntensity() * 100)}%
        </p>
        <p style={{ color: '#d0d7e2', margin: 0 }}>
          <strong>Active Effects:</strong> {Object.values(isEffectEnabled).filter(Boolean).length}
          /12
        </p>
      </div>

      {/* Panel Variants Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {panelVariants.map((variant) => (
          <AugmentedPanel
            key={variant}
            variant={variant}
            style={{ padding: '16px', minHeight: '120px' }}
            onClick={() => setShowModal(true)}
          >
            <h3
              style={{
                color: '#d0d7e2',
                margin: '0 0 8px 0',
                textTransform: 'capitalize',
              }}
            >
              {variant} Panel
            </h3>
            <p
              style={{
                color: '#d0d7e2',
                opacity: 0.8,
                margin: '0 0 12px 0',
                fontSize: '14px',
              }}
            >
              Click to see modal variant
            </p>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {isEffectEnabled('cyberpunkHudFrame') && (
                <span
                  style={{
                    backgroundColor: 'rgba(100, 241, 225, 0.2)',
                    color: '#64f1e1',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  Cyberpunk
                </span>
              )}
              {isEffectEnabled('holographicModal') && (
                <span
                  style={{
                    backgroundColor: 'rgba(100, 241, 225, 0.2)',
                    color: '#64f1e1',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  Holographic
                </span>
              )}
              {isEffectEnabled('temporalEffects') && (
                <span
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: '#a855f7',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  Temporal
                </span>
              )}
            </div>
          </AugmentedPanel>
        ))}
      </div>

      {/* Modal Demo */}
      <AugmentedModal
        open={showModal}
        onOpenChange={setShowModal}
        title="Augmented-UI Modal Demo"
        description="This modal demonstrates the holographic, temporal, and dimensional variants"
        variant="holographic"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#d0d7e2', margin: 0 }}>
            This is a demonstration of the Augmented-UI modal system. The modal adapts its
            appearance based on the selected variant and active feature flags.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(100, 241, 225, 0.2)',
                border: '1px solid rgba(100, 241, 225, 0.4)',
                borderRadius: '6px',
                color: '#d0d7e2',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </AugmentedModal>

      {/* Instructions */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid rgba(100, 241, 225, 0.3)',
        }}
      >
        <h3 style={{ color: '#d0d7e2', margin: '0 0 12px 0' }}>How to Use</h3>
        <ul style={{ color: '#d0d7e2', margin: 0, paddingLeft: '20px' }}>
          <li>Enable "Bypass Accessibility" in Settings to see dramatic effects</li>
          <li>Switch between Cosmic and Timey Wimey themes</li>
          <li>Toggle individual dramatic effects in Settings</li>
          <li>Use performance presets for optimal experience</li>
          <li>Effects automatically respect system accessibility preferences</li>
        </ul>
      </div>
    </div>
  );
};

export default AugmentedDemo;

