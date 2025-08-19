import PropTypes from 'prop-types';
import React from 'react';
import styles from './FloatingDiceButton.module.css';

const FloatingDiceButton = ({ onClick, isOpen }) => {
  return (
    <button
      className={`${styles.floatingButton} ${isOpen ? styles.active : ''}`}
      onClick={onClick}
      aria-label="Open dice roller"
      title="Dice Roller"
    >
      <span className={styles.diceIcon}>🎲</span>
    </button>
  );
};

FloatingDiceButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default FloatingDiceButton;
