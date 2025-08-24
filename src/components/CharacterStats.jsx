import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import { durations, easings, fadeScale } from '../motion/tokens';
import Button from './common/Button';
import ButtonGroup from './common/ButtonGroup';
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
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  return (
    <motion.div
      className={styles.modal}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
    >
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
        <motion.div
          className={styles.hpFill}
          animate={{ width: `${(character.hp / character.maxHp) * 100}%` }}
          transition={transition}
        />
      </div>
      <div className={styles.centerText}>
        HP: {character.hp}/{character.maxHp} | Armor: {totalArmor}
      </div>
      <ButtonGroup className={styles.controls}>
        <Button
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter((prev) => ({
              ...prev,
              hp: Math.min(prev.maxHp, prev.hp + 1),
            }));
          }}
        >
          +1 HP
        </Button>
        <Button
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter((prev) => ({
              ...prev,
              hp: Math.max(0, prev.hp - 1),
            }));
          }}
        >
          -1 HP
        </Button>
      </ButtonGroup>
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
        <motion.div
          className={styles.xpFill}
          animate={{ width: `${(character.xp / character.xpNeeded) * 100}%` }}
          transition={transition}
        />
      </div>
      <div className={styles.centerText} data-testid="xp-display">
        XP: {character.xp}/{character.xpNeeded} (Level {character.level})
      </div>
      <ButtonGroup className={styles.controls}>
        <Button
          onClick={() =>
            setCharacter((prev) => ({
              ...prev,
              xp: prev.xp + 1,
              xpNeeded: prev.level + 7,
            }))
          }
          data-testid="increment-xp"
        >
          +1 XP
        </Button>
        <Button
          onClick={() =>
            setCharacter((prev) => ({
              ...prev,
              xp: Math.max(0, prev.xp - 1),
              xpNeeded: prev.level + 7,
            }))
          }
        >
          -1 XP
        </Button>
      </ButtonGroup>
      {import.meta.env.DEV && (
        <Button onClick={() => setShowLevelUpModal(true)}>Open Level Up Test Modal</Button>
      )}
      {character.xp >= character.xpNeeded && (
        <Button onClick={() => setShowLevelUpModal(true)}>🎉 LEVEL UP AVAILABLE!</Button>
      )}
      <div className={styles.chronoContainer}>
        <ButtonGroup className={`${styles.centerText} ${styles.chronoRow}`}>
          <Button
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
          >
            -1
          </Button>
          <span>Chrono-Retcon Uses: {character.resources.chronoUses}</span>
          <Button
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
          >
            +1
          </Button>
        </ButtonGroup>
        <Button
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
        >
          ⏰ Use Chrono-Retcon
        </Button>
      </div>
      {[
        { key: 'coin', label: 'Coin', max: 999 },
        { key: 'paradoxPoints', label: 'Paradox Points', max: 3 },
        { key: 'bandages', label: 'Bandages', max: 3 },
        { key: 'rations', label: 'Rations', max: 5 },
        { key: 'advGear', label: 'Adventuring Gear', max: 5 },
      ].map(({ key, label, max }) => (
        <div key={key} className={styles.resourceRow}>
          <div className={styles.resourceHeader}>
            <span className={styles.resourceLabel}>{label}:</span>
            <span className={styles.resourceValue}>
              {character.resources[key]}/{max}
            </span>
          </div>
          <ButtonGroup className={styles.resourceButtons}>
            <Button
              onClick={() =>
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    ...prev.resources,
                    [key]: Math.max(0, prev.resources[key] - 1),
                  },
                }))
              }
            >
              -1
            </Button>
            <Button
              onClick={() =>
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    ...prev.resources,
                    [key]: Math.min(max, prev.resources[key] + 1),
                  },
                }))
              }
            >
              +1
            </Button>
          </ButtonGroup>
        </div>
      ))}
      {character.resources.paradoxPoints >= 3 && (
        <div className={styles.warningBox}>
          <div className={styles.warningText}>⚠️ REALITY UNSTABLE! ⚠️</div>
        </div>
      )}
      <Button
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
      >
        🔄 Reset All Resources
      </Button>
    </motion.div>
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
