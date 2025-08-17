import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import { FaSkull } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './LastBreathModal.module.css';

export default function LastBreathModal({ isOpen, onClose, rollDie }) {
  const [result, setResult] = useState(null);
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  useEffect(() => {
    if (isOpen) {
      const total = rollDie(6) + rollDie(6);
      let outcome;
      if (total >= 10) outcome = 'You evade Death... for now.';
      else if (total >= 7) outcome = 'Death offers you a bargain.';
      else outcome = 'Your journey ends here.';
      setResult({ total, outcome });
    } else {
      setResult(null);
    }
  }, [isOpen, rollDie]);

  return (
    <AnimatePresence>
      {isOpen && result && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <motion.div
            className={styles.modal}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
          >
            <h2 className={styles.title}>
              <FaSkull style={{ marginRight: '4px' }} /> Last Breath
            </h2>
            <div className={styles.result}>Roll: {result.total}</div>
            <div className={styles.outcome}>{result.outcome}</div>
            <button onClick={onClose} className={styles.button}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

LastBreathModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rollDie: PropTypes.func.isRequired,
};
