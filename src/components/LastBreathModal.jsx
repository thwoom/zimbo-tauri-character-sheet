import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FaSkull } from 'react-icons/fa6';
import styles from './LastBreathModal.module.css';

export default function LastBreathModal({ isOpen, onClose, rollDie }) {
  const [result, setResult] = useState(null);

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

  if (!isOpen || !result) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          <FaSkull style={{ marginRight: '4px' }} /> Last Breath
        </h2>
        <div className={styles.result}>Roll: {result.total}</div>
        <div className={styles.outcome}>{result.outcome}</div>
        <button onClick={onClose} className={styles.button}>
          Close
        </button>
      </div>
    </div>
  );
}

LastBreathModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rollDie: PropTypes.func.isRequired,
};
