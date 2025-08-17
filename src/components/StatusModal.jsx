import PropTypes from 'prop-types';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './StatusModal.module.css';

const StatusModal = ({
  isOpen = true,
  statusEffects,
  debilities,
  statusEffectTypes,
  debilityTypes,
  onToggleStatusEffect,
  onToggleDebility,
  onClose,
  saveToHistory,
}) => {
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.statusOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <motion.div
            className={styles.statusModal}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
          >
            <h2 className={styles.statusTitle}>💀 Status & Debilities</h2>
            <div>
              <h3 className={styles.statusSubtitle}>Status Effects</h3>
              <ul className={styles.statusList}>
                {Object.keys(statusEffectTypes).map((key) => (
                  <li key={key} className={styles.statusItem}>
                    <label className={styles.statusLabel}>
                      <input
                        type="checkbox"
                        checked={statusEffects.includes(key)}
                        onChange={() => {
                          saveToHistory('Status Change');
                          onToggleStatusEffect(key);
                        }}
                      />{' '}
                      {statusEffectTypes[key].name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.statusSubtitle}>Debilities</h3>
              <ul className={styles.statusList}>
                {Object.keys(debilityTypes).map((key) => (
                  <li key={key} className={styles.statusItem}>
                    <label className={styles.statusLabel}>
                      <input
                        type="checkbox"
                        checked={debilities.includes(key)}
                        onChange={() => {
                          saveToHistory('Debility Change');
                          onToggleDebility(key);
                        }}
                      />{' '}
                      {debilityTypes[key].name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.statusFooter}>
              <button className={styles.statusButton} onClick={onClose}>
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

StatusModal.propTypes = {
  isOpen: PropTypes.bool,
  statusEffects: PropTypes.arrayOf(PropTypes.string).isRequired,
  debilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  statusEffectTypes: PropTypes.object.isRequired,
  debilityTypes: PropTypes.object.isRequired,
  onToggleStatusEffect: PropTypes.func.isRequired,
  onToggleDebility: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  saveToHistory: PropTypes.func.isRequired,
};

export default StatusModal;
