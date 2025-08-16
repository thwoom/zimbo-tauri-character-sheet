import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './DiceRoller.module.css';
import RollModal from './RollModal.jsx';
import AidInterfereModal from './AidInterfereModal.jsx';

const DiceRoller = ({
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

  return (
    <>
      <div className={styles.panel}>
        <h3 className={styles.title}>🎲 Dice Roller</h3>

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
              onClick={() => rollDice('2d6+3', 'Hack & Slash')}
              className={`${styles.button} ${styles.purple} ${styles.small}`}
              aria-label="Roll Hack & Slash"
            >
              Hack & Slash
            </button>
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
              onClick={() => rollDice('2d6+3', 'Hack & Slash')}
              className={`${styles.button} ${styles.purple} ${styles.small}`}
              aria-label="Roll Hack & Slash"
            >
              Hack & Slash
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

        {/* Roll Result Display */}
        <div
          className={`${styles.resultBox} ${animate ? styles.pop : ''}`}
          onAnimationEnd={() => setAnimate(false)}
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
      <RollModal isOpen={rollModal.isOpen} data={rollModalData} onClose={rollModal.close} />
      <AidInterfereModal
        isOpen={aidModal.isOpen}
        onConfirm={aidModal.onConfirm}
        onCancel={aidModal.onCancel}
      />
    </>
  );
};

DiceRoller.propTypes = {
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

export default DiceRoller;
