import PropTypes from 'prop-types';
import React from 'react';
import { FaSkull } from 'react-icons/fa6';
import GlassModal from './ui/GlassModal';

const StatusModal = ({
  isOpen = true,
  statusEffects,
  debilities,
  statusEffectTypes,
  debilityTypes,
  onToggleStatusEffect,
  onToggleDebility,
  onClose,
  saveToHistory,
}) => {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Status & Debilities"
      icon={<FaSkull />}
      maxWidth="600px"
    >
      <div style={{ padding: '0' }}>
        {/* Status Effects Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            color: '#64f1e1',
            marginBottom: '1rem',
            fontSize: '1.1rem',
            borderBottom: '1px solid rgba(100, 241, 225, 0.2)',
            paddingBottom: '0.5rem'
          }}>
            Status Effects
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem'
          }}>
            {Object.keys(statusEffectTypes).map((key) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  background: statusEffects.includes(key)
                    ? 'rgba(100, 241, 225, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    statusEffects.includes(key)
                      ? 'rgba(100, 241, 225, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  borderRadius: '6px',
                  color: statusEffects.includes(key) ? '#64f1e1' : '#d0d7e2',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={statusEffects.includes(key)}
                  onChange={() => {
                    saveToHistory('Status Change');
                    onToggleStatusEffect(key);
                  }}
                  style={{ margin: 0 }}
                />
                <span style={{ fontSize: '0.9rem' }}>{statusEffectTypes[key].name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Debilities Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            color: '#64f1e1',
            marginBottom: '1rem',
            fontSize: '1.1rem',
            borderBottom: '1px solid rgba(100, 241, 225, 0.2)',
            paddingBottom: '0.5rem'
          }}>
            Debilities
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem'
          }}>
            {Object.keys(debilityTypes).map((key) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  background: debilities.includes(key)
                    ? 'rgba(220, 53, 69, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    debilities.includes(key)
                      ? 'rgba(220, 53, 69, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  borderRadius: '6px',
                  color: debilities.includes(key) ? '#dc3545' : '#d0d7e2',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={debilities.includes(key)}
                  onChange={() => {
                    saveToHistory('Debility Change');
                    onToggleDebility(key);
                  }}
                  style={{ margin: 0 }}
                />
                <span style={{ fontSize: '0.9rem' }}>{debilityTypes[key].name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </GlassModal>
  );
};

StatusModal.propTypes = {
  isOpen: PropTypes.bool,
  statusEffects: PropTypes.arrayOf(PropTypes.string).isRequired,
  debilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  statusEffectTypes: PropTypes.object.isRequired,
  debilityTypes: PropTypes.object.isRequired,
  onToggleStatusEffect: PropTypes.func.isRequired,
  onToggleDebility: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  saveToHistory: PropTypes.func.isRequired,
};

export default StatusModal;
