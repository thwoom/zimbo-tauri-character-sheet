import React from 'react';

const StatusModal = ({
  statusEffects,
  debilities,
  statusEffectTypes,
  debilityTypes,
  onToggleStatusEffect,
  onToggleDebility,
  onClose
}) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const modalStyle = {
    background: '#1a1a2e',
    border: '2px solid #00ff88',
    borderRadius: '15px',
    padding: '20px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto'
  };

  const listStyle = { listStyle: 'none', padding: 0 };
  const itemStyle = { marginBottom: '8px' };
  const buttonStyle = {
    background: 'linear-gradient(45deg, #f97316, #ea580c)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    padding: '5px 10px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ color: '#00ff88', textAlign: 'center' }}>💀 Status & Debilities</h2>
        <div>
          <h3 style={{ color: '#00ff88' }}>Status Effects</h3>
          <ul style={listStyle}>
            {Object.keys(statusEffectTypes).map(key => (
              <li key={key} style={itemStyle}>
                <label style={{ color: '#fff' }}>
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
          <h3 style={{ color: '#00ff88' }}>Debilities</h3>
          <ul style={listStyle}>
            {Object.keys(debilityTypes).map(key => (
              <li key={key} style={itemStyle}>
                <label style={{ color: '#fff' }}>
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
        <div style={{ textAlign: 'center' }}>
          <button style={buttonStyle} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
