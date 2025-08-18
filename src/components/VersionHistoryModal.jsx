import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './ExportModal.module.css';

export default function VersionHistoryModal({ isOpen, onClose, versions, onRestore }) {
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);
  const items = useMemo(() => versions || [], [versions]);
  return (
    <AnimatePresence>
      {isOpen && (
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
            <h2 className={styles.title}>Version History</h2>
            {items.length === 0 ? (
              <div>No snapshots yet.</div>
            ) : (
              <ul style={{ maxHeight: '50vh', overflow: 'auto' }}>
                {items.map((v) => (
                  <li
                    key={v.id}
                    style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}
                  >
                    <span style={{ flex: 1 }}>{new Date(v.timestamp).toLocaleString()}</span>
                    <button onClick={() => onRestore(v.character)} data-testid={`restore-${v.id}`}>
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: 12 }}>
              <button onClick={onClose} data-testid="close-versions">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

VersionHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRestore: PropTypes.func.isRequired,
};
