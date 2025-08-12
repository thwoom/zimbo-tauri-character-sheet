import PropTypes from 'prop-types';
import React from 'react';
import styles from './DiceRoller.module.css';
import RollModal from './RollModal.jsx';

const DiceRoller = ({
  character,
  rollDice,
  rollResult,
  rollHistory,
  equippedWeaponDamage,
  rollModal,
  rollModalData,
}) => (
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
              onClick={() => rollDice(`2d6+${data.mod}`, `${stat} Check`)}
              className={`${styles.button} ${styles.purple} ${styles.small}`}
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
          >
            Weapon ({equippedWeaponDamage})
          </button>
          <button
            onClick={() => rollDice('2d6+3', 'Hack & Slash')}
            className={`${styles.button} ${styles.purple} ${styles.small}`}
          >
            Hack & Slash
          </button>
          <button
            onClick={() => rollDice('d4', 'Upper Hand')}
            className={`${styles.button} ${styles.orange} ${styles.small}`}
          >
            Upper Hand d4
          </button>
          <button
            onClick={() => rollDice('2d6-1', 'Taunt')}
            className={`${styles.button} ${styles.amber} ${styles.small}`}
          >
            Taunt Enemy
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
              onClick={() => rollDice(`d${sides}`)}
              className={`${styles.button} ${styles.cyan} ${styles.tiny}`}
            >
              d{sides}
            </button>
          ))}
        </div>
      </div>

      {/* Roll Result Display */}
      <div className={styles.resultBox}>{rollResult}</div>

      {/* Roll History */}
      {rollHistory.length > 0 && (
        <div className={styles.history}>
          <div className={styles.historyTitle}>Recent Rolls:</div>
          {rollHistory.slice(0, 3).map((roll, index) => (
            <div key={index} className={styles.historyItem}>
              <span className={styles.historyTime}>{roll.timestamp}</span> - {roll.result}
            </div>
          ))}
        </div>
      )}
    </div>
    <RollModal isOpen={rollModal.isOpen} data={rollModalData} onClose={rollModal.close} />
  </>
);
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
};

export default DiceRoller;
