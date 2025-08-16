import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './AidInterfereModal.module.css';
import useModalTransition from './common/useModalTransition.js';

export default function AidInterfereModal({ isOpen, onConfirm, onCancel }) {
  const [action, setAction] = useState('aid');
  const [bond, setBond] = useState(0);
  const [isVisible, isActive] = useModalTransition(isOpen);

  if (!isVisible) return null;

  const handleConfirm = () => {
    const bondValue = Math.max(0, Math.min(3, parseInt(bond, 10) || 0));
    onConfirm({ action, bond: bondValue });
  };

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.modal} ${styles.modalEnter} ${isActive ? styles.modalEnterActive : ''}`}
      >
        <h2 className={styles.title}>Aid or Interfere</h2>
        <div className={styles.formRow}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="aidAction"
              value="aid"
              checked={action === 'aid'}
              onChange={() => setAction('aid')}
            />
            Aid
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="aidAction"
              value="interfere"
              checked={action === 'interfere'}
              onChange={() => setAction('interfere')}
            />
            Interfere
          </label>
        </div>
        <div className={styles.formRow}>
          <label htmlFor="bond" className={styles.bondLabel}>
            Bond
            <input
              id="bond"
              type="number"
              min="0"
              max="3"
              value={bond}
              onChange={(e) => setBond(e.target.value)}
              className={styles.bondInput}
            />
          </label>
        </div>
        <div className={styles.actions}>
          <button onClick={handleConfirm} className={styles.button}>
            Confirm
          </button>
          <button onClick={onCancel} className={styles.button}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

AidInterfereModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
