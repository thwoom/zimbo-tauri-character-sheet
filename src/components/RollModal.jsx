import PropTypes from 'prop-types';
import React from 'react';
import styles from './RollModal.module.css';

export default function RollModal({ isOpen, data, onClose }) {
  if (!isOpen || !data) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>🎲 Roll Result</h2>
            <button onClick={onClose} className={styles.closeButton}>
              ×
            </button>
          </div>
        </div>
        <div className={styles.body}>
          {data.originalResult && (
            <div className={styles.original}>Original: {data.originalResult}</div>
          )}
          <div className={styles.result}>
            {data.originalResult ? `With Help: ${data.result}` : data.result}
          </div>
          {data.description && <div className={styles.description}>{data.description}</div>}
          {data.context && <div className={styles.context}>{data.context}</div>}
          <button onClick={onClose} className={styles.button}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

RollModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

RollModal.defaultProps = {
  data: null,
};
