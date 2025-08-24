import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FaMeteor } from 'react-icons/fa6';
import useInventory from '../hooks/useInventory';
import { useCharacter } from '../state/CharacterContext';
import GlassModal from './ui/GlassModal';

export default function DamageModal({ isOpen, onClose, onLastBreath }) {
  const { character, setCharacter } = useCharacter();
  const [damage, setDamage] = useState('');
  const { totalArmor } = useInventory(character, setCharacter);

  const effectiveDamage = () => {
    const dmg = parseInt(damage, 10);
    return isNaN(dmg) ? 0 : Math.max(0, dmg - totalArmor);
  };

  const applyDamage = () => {
    const dmg = parseInt(damage, 10);
    if (isNaN(dmg)) return;
    const finalDamage = Math.max(0, dmg - totalArmor);
    const newHp = Math.max(0, character.hp - finalDamage);
    setCharacter((prev) => ({
      ...prev,
      actionHistory: [
        { action: 'HP Change', state: structuredClone(prev), timestamp: Date.now() },
        ...prev.actionHistory.slice(0, 4),
      ],
      hp: newHp,
    }));
    setDamage('');
    onClose();
    if (newHp <= 0) {
      onLastBreath();
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Damage Calculator"
      icon={<FaMeteor />}
      variant="danger"
      maxWidth="400px"
    >
      <div style={{ padding: '0' }}>
        <div style={{
          padding: '1rem',
          background: 'rgba(220, 53, 69, 0.1)',
          border: '1px solid rgba(220, 53, 69, 0.2)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#dc3545', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Armor: {totalArmor}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            color: '#64f1e1',
            marginBottom: '0.5rem',
            fontSize: '0.9rem'
          }}>
            Incoming Damage:
          </label>
          <input
            type="number"
            placeholder="Enter damage amount"
            value={damage}
            onChange={(e) => setDamage(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#d0d7e2',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{
          padding: '1rem',
          background: 'rgba(100, 241, 225, 0.1)',
          border: '1px solid rgba(100, 241, 225, 0.2)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#64f1e1', fontWeight: 'bold' }}>
            After Armor: {effectiveDamage()}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={applyDamage}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(220, 53, 69, 0.2)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '6px',
              color: '#dc3545',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Apply Damage
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </GlassModal>
  );
}

DamageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLastBreath: PropTypes.func.isRequired,
};
