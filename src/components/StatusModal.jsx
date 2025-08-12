import PropTypes from 'prop-types';
import React from 'react';
import './StatusModal.css';
import { FaRadiation } from 'react-icons/fa6';

const StatusModal = ({
  statusEffects,
  debilities,
  statusEffectTypes,
  debilityTypes,
  onToggleStatusEffect,
  onToggleDebility,
  onClose,
}) => {
  return (
    <div className="status-overlay">
      <div className="status-modal">
        <h2 className="status-title">
          <FaRadiation style={{ marginRight: '4px' }} /> Status & Debilities
        </h2>
        <div>
          <h3 className="status-subtitle">Status Effects</h3>
          <ul className="status-list">
            {Object.keys(statusEffectTypes).map((key) => (
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
            {Object.keys(debilityTypes).map((key) => (
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
          <button className="status-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

StatusModal.propTypes = {
  statusEffects: PropTypes.arrayOf(PropTypes.string).isRequired,
  debilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  statusEffectTypes: PropTypes.object.isRequired,
  debilityTypes: PropTypes.object.isRequired,
  onToggleStatusEffect: PropTypes.func.isRequired,
  onToggleDebility: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatusModal;
