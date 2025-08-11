import PropTypes from 'prop-types';
import React, { useState } from 'react';
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>🏁 End of Session</h2>
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
