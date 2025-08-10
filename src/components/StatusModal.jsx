import React from 'react';
import './StatusModal.css';

const StatusModal = ({
  statusEffects,
  debilities,
  statusEffectTypes,
  debilityTypes,
  onToggleStatusEffect,
  onToggleDebility,
  onClose
}) => {
  return (
    <div className="status-overlay">
      <div className="status-modal">
        <h2 className="status-title">💀 Status & Debilities</h2>
        <div>
          <h3 className="status-subtitle">Status Effects</h3>
          <ul className="status-list">
            {Object.keys(statusEffectTypes).map(key => (
              <li key={key} className="status-item">
                <label className="status-label">
                  <input
                    type="checkbox"
                    checked={statusEffects.includes(key)}
                    onChange={() => onToggleStatusEffect(key)}
                  />{' '}
                  {statusEffectTypes[key].name}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="status-subtitle">Debilities</h3>
          <ul className="status-list">
            {Object.keys(debilityTypes).map(key => (
              <li key={key} className="status-item">
                <label className="status-label">
                  <input
                    type="checkbox"
                    checked={debilities.includes(key)}
                    onChange={() => onToggleDebility(key)}
                  />{' '}
                  {debilityTypes[key].name}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="status-footer">
          <button className="status-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
