import React, { useState } from 'react';
import { useCharacter } from '../state/CharacterContext.jsx';
import styles from './DamageModal.module.css';

export default function DamageModal({ isOpen, onClose }) {
  const { character, setCharacter } = useCharacter();
  const [damage, setDamage] = useState('');

  if (!isOpen) return null;

  const getTotalArmor = () => {
    const baseArmor = character.armor || 0;
    const equippedArmor = character.inventory
      .filter((item) => item.equipped && item.armor)
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
    setCharacter((prev) => {
      const armor = prev.armor || 0;
      const equippedArmor = prev.inventory
        .filter((item) => item.equipped && item.armor)
        .reduce((total, item) => total + (item.armor || 0), 0);
      const totalArmor = armor + equippedArmor;
      const finalDamage = Math.max(0, dmg - totalArmor);
      return {
        ...prev,
        actionHistory: [
          { action: 'HP Change', state: prev, timestamp: Date.now() },
          ...prev.actionHistory.slice(0, 4),
        ],
        hp: Math.max(0, prev.hp - finalDamage),
      };
    });
    setDamage('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>💔 Damage Calculator</h2>
        <div className={styles.info}>Armor: {getTotalArmor()}</div>
        <input
          type="number"
          placeholder="Incoming damage"
          value={damage}
          onChange={(e) => setDamage(e.target.value)}
          className={styles.input}
        />
        <div className={styles.summary}>After armor: {effectiveDamage()}</div>
        <div className={styles.buttonGroup}>
          <button onClick={applyDamage} className={`${styles.button} ${styles.applyButton}`}>
            Apply
          </button>
          <button onClick={onClose} className={styles.button}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
