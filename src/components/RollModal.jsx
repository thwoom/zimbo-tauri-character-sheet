import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaDiceD20 } from 'react-icons/fa6';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import { durations, easings, fadeScale } from '../motion/tokens';
import styles from './RollModal.module.css';

export default function RollModal({ isOpen, data = null, onClose }) {
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);
  return (
    <AnimatePresence>
      {isOpen && data && (
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
            <div className={styles.header}>
              <div className={styles.headerRow}>
                <h2 className={styles.title}>
                  <FaDiceD20 style={{ marginRight: '4px' }} /> Roll Result
                </h2>
                <button onClick={onClose} className={styles.closeButton}>
                  ×
                </button>
              </div>
            </div>
            <div className={styles.body}>
              {data.initialResult && (
                <div className={styles.originalResult}>Original Roll: {data.initialResult}</div>
              )}
              {Array.isArray(data.result) ? (
                <div className={styles.result}>
                  {data.result.map((r, i) => (
                    <div key={i}>{r}</div>
                  ))}
                </div>
              ) : (
                <div className={styles.result}>
                  {data.initialResult ? `With Help: ${data.result}` : data.result}
                </div>
              )}
              {data.description && <div className={styles.description}>{data.description}</div>}
              {data.context && <div className={styles.context}>{data.context}</div>}
              {data.onSpendAmmo && (
                <button onClick={data.onSpendAmmo} className={styles.button}>
                  Spend 1 Ammo
                </button>
              )}
              <button onClick={onClose} className={styles.button}>
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

RollModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
