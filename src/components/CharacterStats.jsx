import PropTypes from 'prop-types';
import { resourceColors } from '../styles/colorMap.js';
import styles from './CharacterStats.module.css';

const CharacterStats = ({
  character,
  setCharacter,
  saveToHistory,
  totalArmor,
  setShowLevelUpModal,
  setRollResult,
  setSessionNotes,
  clearRollHistory,
}) => {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>⚡ Stats &amp; Health</h3>
      <div className={styles.statsGrid}>
        {Object.entries(character.stats).map(([stat, data]) => (
          <div key={stat} className={styles.statItem}>
            <div className={styles.statName}>{stat}</div>
            <div className={styles.statValue}>
              {data.score} ({data.mod >= 0 ? '+' : ''}
              {data.mod})
            </div>
          </div>
        ))}
      </div>
      {/* eslint-disable-next-line jsx-a11y/tabindex-no-positive */}
      <div
        className={styles.hpBarContainer}
        role="progressbar"
        tabIndex={3}
        aria-label="Health points"
        aria-valuenow={character.hp}
        aria-valuemin={0}
        aria-valuemax={character.maxHp}
      >
        <div
          className={styles.hpFill}
          style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
        />
      </div>
      <div className={styles.centerText}>
        HP: {character.hp}/{character.maxHp} | Armor: {totalArmor}
      </div>
      <div className={styles.controls}>
        <button
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter((prev) => ({
              ...prev,
              hp: Math.min(prev.maxHp, prev.hp + 1),
            }));
          }}
          className={styles.button}
        >
          +1 HP
        </button>
        <button
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter((prev) => ({
              ...prev,
              hp: Math.max(0, prev.hp - 1),
            }));
          }}
          className={`${styles.button} ${styles.buttonRed}`}
        >
          -1 HP
        </button>
      </div>
      {/* eslint-disable-next-line jsx-a11y/tabindex-no-positive */}
      <div
        className={styles.xpBarContainer}
        role="progressbar"
        tabIndex={4}
        aria-label="Experience points"
        aria-valuenow={character.xp}
        aria-valuemin={0}
        aria-valuemax={character.xpNeeded}
      >
        <div
          className={styles.xpFill}
          style={{ width: `${(character.xp / character.xpNeeded) * 100}%` }}
        />
      </div>
      <div className={styles.centerText}>
        XP: {character.xp}/{character.xpNeeded} (Level {character.level})
      </div>
      <div className={styles.controls}>
        <button
          onClick={() =>
            setCharacter((prev) => ({
              ...prev,
              xp: prev.xp + 1,
              xpNeeded: prev.level + 7,
            }))
          }
          className={styles.button}
        >
          +1 XP
        </button>
        <button
          onClick={() =>
            setCharacter((prev) => ({
              ...prev,
              xp: Math.max(0, prev.xp - 1),
              xpNeeded: prev.level + 7,
            }))
          }
          className={`${styles.button} ${styles.buttonRed}`}
        >
          -1 XP
        </button>
      </div>
      {import.meta.env.DEV && (
        <button
          onClick={() => setShowLevelUpModal(true)}
          className={`${styles.button} ${styles.devButton}`}
        >
          Open Level Up Test Modal
        </button>
      )}
      {character.xp >= character.xpNeeded && (
        <button
          onClick={() => setShowLevelUpModal(true)}
          className={`${styles.button} ${styles.levelUpButton}`}
        >
          🎉 LEVEL UP AVAILABLE!
        </button>
      )}
      <div className={styles.chronoContainer}>
        <div className={`${styles.centerText} ${styles.chronoRow}`}>
          <button
            aria-label="Decrease Chrono-Retcon"
            onClick={() =>
              setCharacter((prev) => ({
                ...prev,
                resources: {
                  ...prev.resources,
                  chronoUses: Math.max(0, prev.resources.chronoUses - 1),
                },
              }))
            }
            className={styles.minusButton}
          >
            -1
          </button>
          <span>Chrono-Retcon Uses: {character.resources.chronoUses}</span>
          <button
            aria-label="Increase Chrono-Retcon"
            onClick={() =>
              setCharacter((prev) => ({
                ...prev,
                resources: {
                  ...prev.resources,
                  chronoUses: Math.min(2, prev.resources.chronoUses + 1),
                },
              }))
            }
            className={styles.plusButton}
          >
            +1
          </button>
        </div>
        <button
          onClick={() => {
            if (character.resources.chronoUses > 0) {
              setCharacter((prev) => ({
                ...prev,
                resources: {
                  ...prev.resources,
                  chronoUses: Math.max(0, prev.resources.chronoUses - 1),
                },
              }));
              setRollResult('⏰ Chrono-Retcon activated - rewrite any recent action!');
              setTimeout(() => setRollResult('Ready to roll!'), 3000);
            } else {
              setRollResult('❌ No uses remaining!');
              setTimeout(() => setRollResult('Ready to roll!'), 2000);
            }
          }}
          disabled={character.resources.chronoUses === 0}
          className={styles.chronoButton}
        >
          ⏰ Use Chrono-Retcon
        </button>
      </div>
      {[
        { key: 'paradoxPoints', label: 'Paradox Points', max: 3 },
        { key: 'bandages', label: 'Bandages', max: 3 },
        { key: 'rations', label: 'Rations', max: 5 },
        { key: 'advGear', label: 'Adventuring Gear', max: 5 },
      ].map(({ key, label, max }) => (
        <div key={key} className={styles.resourceRow}>
          <div className={styles.resourceHeader}>
            <span className={styles.resourceLabel}>{label}:</span>
            <span className={styles.resourceValue} style={{ color: resourceColors[key] }}>
              {character.resources[key]}/{max}
            </span>
          </div>
          <div className={styles.resourceButtons}>
            <button
              onClick={() =>
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    ...prev.resources,
                    [key]: Math.max(0, prev.resources[key] - 1),
                  },
                }))
              }
              className={styles.minusButton}
            >
              -1
            </button>
            <button
              onClick={() =>
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    ...prev.resources,
                    [key]: Math.min(max, prev.resources[key] + 1),
                  },
                }))
              }
              className={styles.plusButton}
            >
              +1
            </button>
          </div>
        </div>
      ))}
      {character.resources.paradoxPoints >= 3 && (
        <div className={styles.warningBox}>
          <div className={styles.warningText}>⚠️ REALITY UNSTABLE! ⚠️</div>
        </div>
      )}
      <button
        onClick={() => {
          setCharacter((prev) => ({
            ...prev,
            resources: {
              chronoUses: 2,
              paradoxPoints: 0,
              bandages: 3,
              rations: 5,
              advGear: 5,
            },
          }));
          setSessionNotes('');
          clearRollHistory();
          setRollResult('🔄 All resources restored!');
        }}
        className={styles.resetButton}
      >
        🔄 Reset All Resources
      </button>
    </div>
  );
};

CharacterStats.propTypes = {
  character: PropTypes.shape({
    stats: PropTypes.object.isRequired,
    hp: PropTypes.number.isRequired,
    maxHp: PropTypes.number.isRequired,
    xp: PropTypes.number.isRequired,
    xpNeeded: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    resources: PropTypes.object.isRequired,
  }).isRequired,
  setCharacter: PropTypes.func.isRequired,
  saveToHistory: PropTypes.func.isRequired,
  totalArmor: PropTypes.number.isRequired,
  setShowLevelUpModal: PropTypes.func.isRequired,
  setRollResult: PropTypes.func.isRequired,
  setSessionNotes: PropTypes.func,
  clearRollHistory: PropTypes.func,
};

CharacterStats.defaultProps = {
  setSessionNotes: () => {},
  clearRollHistory: () => {},
};

export default CharacterStats;
