import React from 'react';

const buttonStyle = {
  background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
  border: 'none',
  borderRadius: '6px',
  color: 'white',
  padding: '8px 15px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  margin: '5px'
};

export default function BondsModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
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
      }}
    >
      <div
        style={{
          background: '#1a1a2e',
          border: '2px solid #00ff88',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ color: '#00ff88' }}>👥 Character Bonds</h2>
        <p style={{ color: '#aaa', margin: '20px 0' }}>Component coming soon...</p>
        <button onClick={onClose} style={buttonStyle}>Close</button>
      </div>
    </div>
  );
}
