import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styles from './DiceRollerModal.module.css';
import RollModal from './RollModal';
import AidInterfereModal from './AidInterfereModal';
import safeLocalStorage from '../utils/safeLocalStorage.js';

const DiceRollerModal = ({
  isOpen,
  onClose,
  character,
  rollDice,
  rollResult,
  rollHistory,
  equippedWeaponDamage,
  rollModal,
  rollModalData,
  aidModal,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [presets, setPresets] = useState(() => {
    const saved = safeLocalStorage.getItem('rollPresets');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [presetName, setPresetName] = useState('');
  const [presetFormula, setPresetFormula] = useState('');

  const handleRoll = (expr, label) => {
    setIsRolling(true);
    if (label !== undefined) {
      rollDice(expr, label);
    } else {
      rollDice(expr);
    }
    setTimeout(() => {
      setIsRolling(false);
      setAnimate(true);
    }, 350);
  };

  useEffect(() => {
    if (presets.length > 0) {
      safeLocalStorage.setItem('rollPresets', JSON.stringify(presets));
    } else {
      safeLocalStorage.removeItem('rollPresets');
    }
  }, [presets]);

  const addPreset = () => {
    const name = presetName.trim();
    const formula = presetFormula.trim();
    if (!name || !/^\d*d\d+(?:[+-]\d+)?$/i.test(formula)) return;
    setPresets((prev) => {
      const next = [...prev.filter((p) => p.name !== name), { name, formula }];
      return next.slice(0, 12);
    });
    setPresetName('');
    setPresetFormula('');
  };

  const removePreset = (name) => {
    setPresets((prev) => prev.filter((p) => p.name !== name));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} role="presentation">
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.header}>
            <h3 className={styles.title}>🎲 Dice Roller</h3>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close dice roller">
              ×
            </button>
          </div>

          <div className={styles.content}>
            {/* Stat Check Buttons */}
            <div className={styles.section}>
              <h4 className={styles.subtitle}>Stat Checks</h4>
              <div className={styles.statGrid}>
                {Object.entries(character.stats).map(([stat, data]) => (
                  <button
                    key={stat}
                    onClick={() => handleRoll(`2d6+${data.mod}`, `${stat} Check`)}
                    className={`${styles.button} ${styles.purple} ${styles.small}`}
                    aria-label={`Roll ${stat} Check`}
                  >
                    {stat} ({data.mod >= 0 ? '+' : ''}
                    {data.mod})
                  </button>
                ))}
              </div>
            </div>

            {/* Combat Rolls */}
            <div className={styles.section}>
              <h4 className={styles.subtitle}>Combat Rolls</h4>
              <div className={styles.combatGrid}>
                <button
                  onClick={() => rollDice(equippedWeaponDamage, 'Weapon Damage')}
                  className={`${styles.button} ${styles.red} ${styles.small}`}
                  aria-label={`Roll weapon damage ${equippedWeaponDamage}`}
                >
                  Weapon ({equippedWeaponDamage})
                </button>
                <button
                  onClick={() => rollDice(`2d6+${character.stats.STR.mod}`, 'Hack & Slash')}
                  className={`${styles.button} ${styles.purple} ${styles.small}`}
                  aria-label="Roll Hack & Slash"
                >
                  Hack & Slash ({character.stats.STR.mod >= 0 ? '+' : ''}
                  {character.stats.STR.mod})
                </button>
                <button
                  onClick={() => rollDice('d4', 'Upper Hand')}
                  className={`${styles.button} ${styles.orange} ${styles.small}`}
                  aria-label="Roll Upper Hand d4"
                >
                  Upper Hand d4
                </button>
                <button
                  onClick={() => rollDice('2d6-1', 'Taunt')}
                  className={`${styles.button} ${styles.amber} ${styles.small}`}
                  aria-label="Roll Taunt Enemy"
                >
                  Taunt Enemy
                </button>
                <button
                  onClick={() => rollDice('2d6', 'Aid/Interfere')}
                  className={`${styles.button} ${styles.purple} ${styles.small}`}
                  aria-label="Roll Aid or Interfere"
                >
                  Aid/Interfere
                </button>
              </div>
            </div>

            {/* Basic Dice */}
            <div className={styles.section}>
              <h4 className={styles.subtitle}>Basic Dice</h4>
              <div className={styles.basicGrid}>
                {[4, 6, 8, 10, 12, 20].map((sides) => (
                  <button
                    key={sides}
                    onClick={() => handleRoll(`d${sides}`)}
                    className={`${styles.button} ${styles.cyan} ${styles.tiny}`}
                    aria-label={`Roll d${sides}`}
                  >
                    {`d${sides}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Roll Presets */}
            <div className={styles.section}>
              <h4 className={styles.subtitle}>Roll Presets</h4>
              {presets.length > 0 && (
                <div className={styles.combatGrid}>
                  {presets.map((p) => (
                    <div key={p.name} className={styles.presetItem}>
                      <button
                        onClick={() => handleRoll(p.formula, p.name)}
                        className={`${styles.button} ${styles.purple} ${styles.small}`}
                        aria-label={`Roll preset ${p.name}`}
                      >
                        {p.name}
                      </button>
                      <button
                        className={`${styles.button} ${styles.tiny}`}
                        aria-label={`Remove preset ${p.name}`}
                        onClick={() => removePreset(p.name)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.presetForm}>
                <input
                  placeholder="Name (e.g., Volley)"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className={styles.input}
                  aria-label="Preset name"
                />
                <input
                  placeholder="Formula (e.g., 2d6+DEX)"
                  value={presetFormula}
                  onChange={(e) => setPresetFormula(e.target.value)}
                  className={styles.input}
                  aria-label="Preset formula"
                />
                <button
                  onClick={addPreset}
                  className={`${styles.button} ${styles.green} ${styles.small}`}
                  aria-label="Add preset"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Roll Result Display */}
            <div
              className={`${styles.resultBox} ${animate ? styles.pop : ''}`}
              onAnimationEnd={() => setAnimate(false)}
              aria-live="polite"
            >
              {isRolling ? 'rolling…' : rollResult}
            </div>

            {/* Roll History */}
            {rollHistory.length > 0 && (
              <div className={styles.history}>
                <div className={styles.historyTitle}>Recent Rolls:</div>
                {rollHistory.slice(0, 3).map((roll) => (
                  <div key={roll.timestamp} className={styles.historyItem}>
                    <span className={styles.historyTime}>
                      {new Date(roll.timestamp).toLocaleTimeString()}
                    </span>
                    {' - '}
                    {roll.result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <RollModal isOpen={rollModal.isOpen} data={rollModalData} onClose={rollModal.close} />
      <AidInterfereModal
        isOpen={aidModal.isOpen}
        onConfirm={aidModal.onConfirm}
        onCancel={aidModal.onCancel}
      />
    </>
  );
};

DiceRollerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  character: PropTypes.shape({
    stats: PropTypes.object.isRequired,
  }).isRequired,
  rollDice: PropTypes.func.isRequired,
  rollResult: PropTypes.string.isRequired,
  rollHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  equippedWeaponDamage: PropTypes.string.isRequired,
  rollModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
  }).isRequired,
  rollModalData: PropTypes.object.isRequired,
  aidModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }).isRequired,
};

export default DiceRollerModal;
