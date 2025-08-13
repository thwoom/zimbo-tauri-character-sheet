import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FaFlagCheckered } from 'react-icons/fa6';
import { useCharacter } from '../state/CharacterContext.jsx';
import styles from './EndSessionModal.module.css';

const defaultAnswers = () => ({
  q1: false,
  q2: false,
  q3: false,
  alignment: false,
});

export default function EndSessionModal({ isOpen, onClose, onLevelUp }) {
  const { character, setCharacter } = useCharacter();
  const [answers, setAnswers] = useState(defaultAnswers);
  const [resolvedBonds, setResolvedBonds] = useState([]);
  const [replacementBonds, setReplacementBonds] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnswers(defaultAnswers());
      setResolvedBonds([]);
      setReplacementBonds({});
    }
    return () => {
      if (isOpen) {
        setAnswers(defaultAnswers());
        setResolvedBonds([]);
        setReplacementBonds({});
      }
    };
  }, [isOpen]);

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

  const handleRecapTextChange = (key, text) => {
    setRecapAnswers((prev) => ({
      ...prev,
      [key]: { ...prev[key], text },
    }));
  };

  const toggleRecapPublic = (key) => {
    setRecapAnswers((prev) => ({
      ...prev,
      [key]: { ...prev[key], isPublic: !prev[key].isPublic },
    }));
  };

  const totalXP = Object.values(answers).filter(Boolean).length + resolvedBonds.length;

  const handleEnd = () => {
    const missingRecap = Object.values(recapAnswers).some(({ text }) => !text.trim());
    if (missingRecap) {
      setError('Please complete all recap fields.');
      return;
    }

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

      const sessionRecap = Object.fromEntries(
        Object.entries(recapAnswers).map(([key, { text }]) => [key, text.trim()]),
      );

      const sessionRecapPublic = Object.fromEntries(
        Object.entries(recapAnswers)
          .filter(([, { isPublic, text }]) => isPublic && text.trim())
          .map(([key, { text }]) => [key, text.trim()]),
      );

      return {
        ...prev,
        xp: newXp,
        xpNeeded: prev.level + 7,
        bonds: [...remainingBonds, ...newBonds],
        sessionRecap,
        ...(Object.keys(sessionRecapPublic).length > 0 && { sessionRecapPublic }),
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

        <div className={styles.section}>
          <h3 className={styles.title}>Session Recap</h3>
          <div className={styles.recapItem}>
            <label className={styles.recapLabel}>
              Highlights
              <textarea
                value={recapAnswers.highlights.text}
                onChange={(e) => handleRecapTextChange('highlights', e.target.value)}
                className={styles.textarea}
              />
            </label>
            <label className={styles.shareLabel}>
              <input
                type="checkbox"
                checked={recapAnswers.highlights.isPublic}
                onChange={() => toggleRecapPublic('highlights')}
              />{' '}
              Share publicly
            </label>
          </div>
          <div className={styles.recapItem}>
            <label className={styles.recapLabel}>
              NPC Encounters
              <textarea
                value={recapAnswers.npcEncounters.text}
                onChange={(e) => handleRecapTextChange('npcEncounters', e.target.value)}
                className={styles.textarea}
              />
            </label>
            <label className={styles.shareLabel}>
              <input
                type="checkbox"
                checked={recapAnswers.npcEncounters.isPublic}
                onChange={() => toggleRecapPublic('npcEncounters')}
              />{' '}
              Share publicly
            </label>
          </div>
          <div className={styles.recapItem}>
            <label className={styles.recapLabel}>
              Loose Ends
              <textarea
                value={recapAnswers.looseEnds.text}
                onChange={(e) => handleRecapTextChange('looseEnds', e.target.value)}
                className={styles.textarea}
              />
            </label>
            <label className={styles.shareLabel}>
              <input
                type="checkbox"
                checked={recapAnswers.looseEnds.isPublic}
                onChange={() => toggleRecapPublic('looseEnds')}
              />{' '}
              Share publicly
            </label>
          </div>
          <div className={styles.recapItem}>
            <label className={styles.recapLabel}>
              Next Steps
              <textarea
                value={recapAnswers.nextSteps.text}
                onChange={(e) => handleRecapTextChange('nextSteps', e.target.value)}
                className={styles.textarea}
              />
            </label>
            <label className={styles.shareLabel}>
              <input
                type="checkbox"
                checked={recapAnswers.nextSteps.isPublic}
                onChange={() => toggleRecapPublic('nextSteps')}
              />{' '}
              Share publicly
            </label>
          </div>
        </div>

        <div className={styles.total}>Total XP Gained: {totalXP}</div>
        {error && <div className={styles.error}>{error}</div>}

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
