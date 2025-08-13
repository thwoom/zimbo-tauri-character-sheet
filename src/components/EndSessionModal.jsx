import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FaFlagCheckered } from 'react-icons/fa6';
import { useCharacter } from '../state/CharacterContext.jsx';
import styles from './EndSessionModal.module.css';

export default function EndSessionModal({ isOpen, onClose, onLevelUp }) {
  const { character, setCharacter } = useCharacter();
  const [answers, setAnswers] = useState({
    q1: false,
    q2: false,
    q3: false,
    alignment: false,
  });
  const [resolvedBonds, setResolvedBonds] = useState([]);
  const [replacementBonds, setReplacementBonds] = useState({});

  if (!isOpen) return null;

  const toggleAnswer = (key) => {
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBond = (index) => {
    setResolvedBonds((prev) => {
      if (prev.includes(index)) {
        setReplacementBonds((r) => {
          const rest = { ...r };
          delete rest[index];
          return rest;
        });
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleBondTextChange = (index, text) => {
    setReplacementBonds((prev) => ({ ...prev, [index]: text }));
  };

  const totalXP = Object.values(answers).filter(Boolean).length + resolvedBonds.length;

  const handleEnd = () => {
    const xpGained = totalXP;
    const newXp = character.xp + xpGained;
    setCharacter((prev) => {
      const remainingBonds = prev.bonds.filter((_, idx) => !resolvedBonds.includes(idx));
      const newBonds = resolvedBonds
        .map((idx) => {
          const text = replacementBonds[idx]?.trim();
          if (!text) return null;
          return {
            name: prev.bonds[idx].name,
            relationship: text,
            resolved: false,
          };
        })
        .filter(Boolean);

      return {
        ...prev,
        xp: newXp,
        xpNeeded: prev.level + 7,
        bonds: [...remainingBonds, ...newBonds],
      };
    });

    if (newXp >= character.xpNeeded) {
      onLevelUp();
    }

    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          <FaFlagCheckered style={{ marginRight: '4px' }} /> End of Session
        </h2>
        <div className={styles.section}>
          <label>
            <input type="checkbox" checked={answers.q1} onChange={() => toggleAnswer('q1')} /> Did
            we learn something new and important about the world?
          </label>
        </div>
        <div className={styles.section}>
          <label>
            <input type="checkbox" checked={answers.q2} onChange={() => toggleAnswer('q2')} /> Did
            we overcome a notable monster or enemy?
          </label>
        </div>
        <div className={styles.section}>
          <label>
            <input type="checkbox" checked={answers.q3} onChange={() => toggleAnswer('q3')} /> Did
            we loot a memorable treasure?
          </label>
        </div>
        <div className={styles.section}>
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
          <div className={styles.section}>
            <h3 className={styles.title}>Bonds Resolved</h3>
            <ul className={styles.bondList}>
              {character.bonds.map((bond, idx) => (
                <li key={idx} className={styles.bondItem}>
                  <label>
                    <input
                      type="checkbox"
                      checked={resolvedBonds.includes(idx)}
                      onChange={() => toggleBond(idx)}
                    />{' '}
                    {bond.name}: {bond.relationship}
                  </label>
                  {resolvedBonds.includes(idx) && (
                    <input
                      type="text"
                      placeholder="New bond text"
                      value={replacementBonds[idx] || ''}
                      onChange={(e) => handleBondTextChange(idx, e.target.value)}
                      className={styles.bondInput}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.total}>Total XP Gained: {totalXP}</div>

        <div className={styles.actions}>
          <button onClick={handleEnd} className={styles.button}>
            End Session
          </button>
          <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

EndSessionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLevelUp: PropTypes.func.isRequired,
};
