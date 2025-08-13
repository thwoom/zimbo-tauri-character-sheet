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
  const [inventoryChanges, setInventoryChanges] = useState({});
  const [coinChange, setCoinChange] = useState(0);
  const [clearedStatus, setClearedStatus] = useState([]);
  const [clearedDebilities, setClearedDebilities] = useState([]);

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

  const handleInventoryChange = (id, value) => {
    setInventoryChanges((prev) => ({ ...prev, [id]: value }));
  };

  const toggleStatus = (effect) => {
    setClearedStatus((prev) =>
      prev.includes(effect) ? prev.filter((e) => e !== effect) : [...prev, effect],
    );
  };

  const toggleDebility = (debility) => {
    setClearedDebilities((prev) =>
      prev.includes(debility) ? prev.filter((d) => d !== debility) : [...prev, debility],
    );
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

      const updatedInventory = prev.inventory
        .map((item) => {
          const change = inventoryChanges[item.id];
          if (item.quantity != null) {
            const used = Number(change) || 0;
            const newQty = item.quantity - used;
            if (newQty > 0) return { ...item, quantity: newQty };
            if (used > 0) return null;
            return item;
          }
          if (change) return null;
          return item;
        })
        .filter(Boolean);

      const updatedResources = {
        ...prev.resources,
        coin: (prev.resources.coin || 0) + Number(coinChange || 0),
      };

      return {
        ...prev,
        xp: newXp,
        bonds: [...remainingBonds, ...newBonds],
        inventory: updatedInventory,
        resources: updatedResources,
        statusEffects: prev.statusEffects.filter((e) => !clearedStatus.includes(e)),
        debilities: prev.debilities.filter((d) => !clearedDebilities.includes(d)),
      };
    });

    if (newXp >= character.level + 7) {
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

        {character.inventory.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.title}>Item Usage</h3>
            <ul className={styles.bondList}>
              {character.inventory.map((item) => (
                <li key={item.id} className={styles.bondItem}>
                  {item.quantity != null ? (
                    <label>
                      {item.name} used:{' '}
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={inventoryChanges[item.id] || 0}
                        onChange={(e) => handleInventoryChange(item.id, e.target.value)}
                        aria-label={`Used ${item.name}`}
                        className={styles.bondInput}
                      />
                    </label>
                  ) : (
                    <label>
                      <input
                        type="checkbox"
                        checked={inventoryChanges[item.id] || false}
                        onChange={(e) => handleInventoryChange(item.id, e.target.checked)}
                      />{' '}
                      {item.name} used up
                    </label>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.section}>
          <label>
            Coin change:
            <input
              type="number"
              value={coinChange}
              onChange={(e) => setCoinChange(e.target.value)}
              className={styles.bondInput}
            />
          </label>
        </div>

        {(character.statusEffects.length > 0 || character.debilities.length > 0) && (
          <div className={styles.section}>
            <h3 className={styles.title}>Clear Temporary Effects</h3>
            {character.statusEffects.map((effect) => (
              <div key={effect}>
                <label>
                  <input
                    type="checkbox"
                    checked={clearedStatus.includes(effect)}
                    onChange={() => toggleStatus(effect)}
                  />{' '}
                  {effect}
                </label>
              </div>
            ))}
            {character.debilities.map((debility) => (
              <div key={debility}>
                <label>
                  <input
                    type="checkbox"
                    checked={clearedDebilities.includes(debility)}
                    onChange={() => toggleDebility(debility)}
                  />{' '}
                  {debility}
                </label>
              </div>
            ))}
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
