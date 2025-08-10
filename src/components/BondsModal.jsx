import React, { useState } from 'react';
import { useCharacter } from '../state/CharacterContext';

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

const inputStyle = {
  background: '#0f0f1f',
  border: '1px solid #00ff88',
  borderRadius: '6px',
  color: 'white',
  padding: '8px',
  width: '100%',
};

export default function BondsModal({ isOpen, onClose }) {
  const { character, setCharacter } = useCharacter();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');

  if (!isOpen) return null;

  const addBond = () => {
    if (name.trim() && relationship.trim()) {
      setCharacter((prev) => ({
        ...prev,
        bonds: [
          ...prev.bonds,
          { name: name.trim(), relationship: relationship.trim(), resolved: false },
        ],
      }));
      setName('');
      setRelationship('');
    }
  };

  const removeBond = (index) => {
    setCharacter((prev) => ({
      ...prev,
      bonds: prev.bonds.filter((_, i) => i !== index),
    }));
  };

  const toggleResolved = (index) => {
    setCharacter((prev) => ({
      ...prev,
      bonds: prev.bonds.map((bond, i) =>
        i === index ? { ...bond, resolved: !bond.resolved } : bond,
      ),
    }));
  };

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
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#1a1a2e',
          border: '2px solid #00ff88',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center',
          width: '400px',
          maxHeight: '80%',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ color: '#00ff88' }}>👥 Character Bonds</h2>
        {character.bonds.length === 0 ? (
          <p style={{ color: '#aaa', margin: '20px 0' }}>No bonds yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
            {character.bonds.map((bond, index) => (
              <li key={index} style={{ marginBottom: '15px', textAlign: 'left' }}>
                <div
                  style={{
                    textDecoration: bond.resolved ? 'line-through' : 'none',
                    color: '#fff',
                  }}
                >
                  <strong>{bond.name}</strong>: {bond.relationship}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <button
                    onClick={() => toggleResolved(index)}
                    style={{
                      ...buttonStyle,
                      background: bond.resolved
                        ? 'linear-gradient(45deg, #6366f1, #4f46e5)'
                        : 'linear-gradient(45deg, #10b981, #059669)',
                    }}
                  >
                    {bond.resolved ? 'Unresolve' : 'Resolve'}
                  </button>
                  <button
                    onClick={() => removeBond(index)}
                    style={{
                      ...buttonStyle,
                      background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div style={{ textAlign: 'left' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ ...inputStyle, marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            style={{ ...inputStyle, marginBottom: '10px' }}
          />
          <button onClick={addBond} style={buttonStyle}>
            Add Bond
          </button>
        </div>

        <button onClick={onClose} style={{ ...buttonStyle, marginTop: '20px' }}>
          Close
        </button>
      </div>
    </div>
  );
}
