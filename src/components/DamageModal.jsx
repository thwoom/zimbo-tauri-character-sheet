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
  margin: '5px'
};

const inputStyle = {
  background: '#0f0f1f',
  border: '1px solid #00ff88',
  borderRadius: '6px',
  color: 'white',
  padding: '8px',
  width: '100%'
};

export default function DamageModal({ isOpen, onClose }) {
  const { character, setCharacter } = useCharacter();
  const [damage, setDamage] = useState('');

  if (!isOpen) return null;

  const getTotalArmor = () => {
    const baseArmor = character.armor || 0;
    const equippedArmor = character.inventory
      .filter(item => item.equipped && item.armor)
      .reduce((total, item) => total + (item.armor || 0), 0);
    return baseArmor + equippedArmor;
  };

  const effectiveDamage = () => {
    const dmg = parseInt(damage, 10);
    return isNaN(dmg) ? 0 : Math.max(0, dmg - getTotalArmor());
  };

  const applyDamage = () => {
    const dmg = parseInt(damage, 10);
    if (isNaN(dmg)) return;
    setCharacter(prev => {
      const armor = prev.armor || 0;
      const equippedArmor = prev.inventory
        .filter(item => item.equipped && item.armor)
        .reduce((total, item) => total + (item.armor || 0), 0);
      const totalArmor = armor + equippedArmor;
      const finalDamage = Math.max(0, dmg - totalArmor);
      return {
        ...prev,
        actionHistory: [
          { action: 'HP Change', state: prev, timestamp: Date.now() },
          ...prev.actionHistory.slice(0, 4)
        ],
        hp: Math.max(0, prev.hp - finalDamage)
      };
    });
    setDamage('');
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
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          background: '#1a1a2e',
          border: '2px solid #00ff88',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center',
          width: '300px'
        }}
      >
        <h2 style={{ color: '#00ff88' }}>💔 Damage Calculator</h2>
        <div style={{ margin: '15px 0', color: '#fff' }}>Armor: {getTotalArmor()}</div>
        <input
          type="number"
          placeholder="Incoming damage"
          value={damage}
          onChange={e => setDamage(e.target.value)}
          style={{ ...inputStyle, marginBottom: '10px' }}
        />
        <div style={{ color: '#aaa', marginBottom: '20px' }}>
          After armor: {effectiveDamage()}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={applyDamage}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(45deg, #ef4444, #dc2626)'
            }}
          >
            Apply
          </button>
          <button onClick={onClose} style={buttonStyle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
