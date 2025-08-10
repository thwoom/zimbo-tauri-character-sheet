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
  margin: '5px',
};

export default function RollModal({ isOpen, data, onClose }) {
  if (!isOpen || !data) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          border: '2px solid #00ff88',
          borderRadius: '15px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(45deg, #0f3460, #533483)',
            borderRadius: '13px 13px 0 0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#00ff88', margin: 0 }}>🎲 Roll Result</h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.8)',
                border: '2px solid #ef4444',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '8px',
              }}
            >
              ×
            </button>
          </div>
        </div>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#00ff88',
              marginBottom: '15px',
            }}
          >
            {data.result}
          </div>
          {data.description && (
            <div style={{ color: '#e0e0e0', marginBottom: '15px' }}>{data.description}</div>
          )}
          {data.context && (
            <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>
              {data.context}
            </div>
          )}
          <button onClick={onClose} style={buttonStyle}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
