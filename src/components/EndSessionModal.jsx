import React, { useState } from 'react';
import { useCharacter } from '../state/CharacterContext.jsx';

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

export default function EndSessionModal({ isOpen, onClose, onLevelUp }) {
  const { character, setCharacter } = useCharacter();
  const [answers, setAnswers] = useState({
    q1: false,
    q2: false,
    q3: false,
    alignment: false,
  });
  const [resolvedBonds, setResolvedBonds] = useState([]);

  if (!isOpen) return null;

  const toggleAnswer = (key) => {
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBond = (index) => {
    setResolvedBonds((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const totalXP = Object.values(answers).filter(Boolean).length + resolvedBonds.length;

  const handleEnd = () => {
    const xpGained = totalXP;
    const newXp = character.xp + xpGained;
    setCharacter((prev) => ({
      ...prev,
      xp: newXp,
      bonds: prev.bonds.filter((_, idx) => !resolvedBonds.includes(idx)),
    }));

    if (newXp >= character.level + 7) {
      onLevelUp();
    }

    onClose();
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
        <h2 style={{ color: '#00ff88' }}>🏁 End of Session</h2>
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label>
            <input type="checkbox" checked={answers.q1} onChange={() => toggleAnswer('q1')} /> Did
            we learn something new and important about the world?
          </label>
        </div>
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label>
            <input type="checkbox" checked={answers.q2} onChange={() => toggleAnswer('q2')} /> Did
            we overcome a notable monster or enemy?
          </label>
        </div>
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label>
            <input type="checkbox" checked={answers.q3} onChange={() => toggleAnswer('q3')} /> Did
            we loot a memorable treasure?
          </label>
        </div>
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={answers.alignment}
              onChange={() => toggleAnswer('alignment')}
            />{' '}
            Did you fulfill your alignment/drive?
          </label>
        </div>

        {character.bonds.length > 0 && (
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <h3 style={{ color: '#00ff88' }}>Bonds Resolved</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {character.bonds.map((bond, idx) => (
                <li key={idx} style={{ marginBottom: '5px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={resolvedBonds.includes(idx)}
                      onChange={() => toggleBond(idx)}
                    />{' '}
                    {bond.name}: {bond.relationship}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: '10px', color: '#fff' }}>Total XP Gained: {totalXP}</div>

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleEnd} style={buttonStyle}>
            End Session
          </button>
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(45deg, #ef4444, #dc2626)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
