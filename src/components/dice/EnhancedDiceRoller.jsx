/**
 * Enhanced DiceRoller with futuristic styling and 3D dice
 */
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { containerVariants, itemVariants } from '../../motion/variants';
import { useDice } from '../../state/DiceContext';
import Button from '../common/Button';
import styles from '../DiceRoller.module.css';

const EnhancedDiceRoller = ({
  character,
  rollDice,
  rollResult,
  rollHistory,
  equippedWeaponDamage,
  rollModal,
  rollModalData,
  aidModal,
}) => {
  const { startRoll, endRoll } = useDice();

  const handleRoll = useCallback(
    (expr, label) => {
      startRoll();

      if (label !== undefined) {
        rollDice(expr, label);
      } else {
        rollDice(expr);
      }

      // Simulate dice roll duration
      setTimeout(() => {
        const result = rollResult?.result || Math.floor(Math.random() * 12) + 2;
        endRoll(result);

        // Trigger celebration for critical results
        if (result >= 12) {
          window.dispatchEvent(
            new CustomEvent('zimbo-celebration', {
              detail: { type: 'critical' },
            }),
          );
        }
      }, 2000);
    },
    [rollDice, rollResult, startRoll, endRoll],
  );

  const handleLevelUp = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('zimbo-celebration', {
        detail: { type: 'levelup' },
      }),
    );
  }, []);

  return (
    <motion.div
      className={styles.panel}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 className={styles.title} variants={itemVariants}>
        🎲 Dice Roller
      </motion.h3>

      {/* Stat Check Buttons */}
      <motion.div className={styles.section} variants={itemVariants}>
        <h4 className={styles.subtitle}>Stat Checks</h4>
        <motion.div className={styles.statGrid} variants={containerVariants}>
          {Object.entries(character.stats).map(([stat, data]) => (
            <motion.div key={stat} variants={itemVariants}>
              <Button
                onClick={() => handleRoll(`2d6+${data.mod}`, `${stat} Check`)}
                variant={data.mod >= 2 ? 'success' : data.mod >= 0 ? 'default' : 'danger'}
                glow={data.mod >= 3}
                className={`${styles.small} w-full`}
                aria-label={`Roll ${stat} Check`}
              >
                {stat} ({data.mod >= 0 ? '+' : ''}
                {data.mod})
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Basic Moves */}
      <motion.div className={styles.section} variants={itemVariants}>
        <h4 className={styles.subtitle}>Basic Moves</h4>
        <motion.div className={styles.moveGrid} variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => handleRoll('2d6+1', 'Hack and Slash')}
              variant="danger"
              glow
              className={styles.moveButton}
            >
              ⚔️ Hack and Slash
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => handleRoll('2d6', 'Defy Danger')}
              variant="neon"
              className={styles.moveButton}
            >
              🛡️ Defy Danger
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => handleRoll('2d6+1', 'Spout Lore')}
              variant="success"
              className={styles.moveButton}
            >
              📚 Spout Lore
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Damage Rolls */}
      <motion.div className={styles.section} variants={itemVariants}>
        <h4 className={styles.subtitle}>Damage</h4>
        <motion.div className={styles.damageGrid} variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => handleRoll(equippedWeaponDamage || '1d8', 'Weapon Damage')}
              variant="danger"
              glow={!!equippedWeaponDamage}
              className={styles.damageButton}
            >
              🗡️ Weapon ({equippedWeaponDamage || '1d8'})
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => handleRoll('1d4', 'Improvised Damage')}
              variant="default"
              className={styles.damageButton}
            >
              🪨 Improvised (1d4)
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Custom Dice */}
      <motion.div className={styles.section} variants={itemVariants}>
        <h4 className={styles.subtitle}>Custom Dice</h4>
        <motion.div className={styles.customGrid} variants={containerVariants}>
          {[4, 6, 8, 10, 12, 20].map((sides) => (
            <motion.div key={sides} variants={itemVariants}>
              <Button
                onClick={() => handleRoll(`1d${sides}`, `d${sides}`)}
                variant="default"
                className={styles.diceButton}
              >
                d{sides}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Roll History */}
      <AnimatePresence>
        {rollHistory.length > 0 && (
          <motion.div
            className={styles.history}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            variants={itemVariants}
          >
            <h4 className={styles.subtitle}>Recent Rolls</h4>
            <div className={styles.historyList}>
              {rollHistory
                .slice(-3)
                .reverse()
                .map((roll, index) => (
                  <motion.div
                    key={`${roll.timestamp}-${index}`}
                    className={`${styles.historyItem} ${
                      roll.result >= 10
                        ? styles.success
                        : roll.result >= 7
                          ? styles.partial
                          : styles.failure
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className={styles.rollLabel}>{roll.label}</span>
                    <span className={styles.rollResult}>{roll.result}</span>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test celebration button (dev only) */}
      {import.meta.env.DEV && (
        <motion.div className="mt-4" variants={itemVariants}>
          <Button onClick={handleLevelUp} variant="neon" glow className="w-full">
            🎉 Test Level Up Effect
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

EnhancedDiceRoller.propTypes = {
  character: PropTypes.object.isRequired,
  rollDice: PropTypes.func.isRequired,
  rollResult: PropTypes.object,
  rollHistory: PropTypes.array.isRequired,
  equippedWeaponDamage: PropTypes.string,
  rollModal: PropTypes.object.isRequired,
  rollModalData: PropTypes.object,
  aidModal: PropTypes.object.isRequired,
};

export default EnhancedDiceRoller;
