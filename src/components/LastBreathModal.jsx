import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FaSkull } from 'react-icons/fa6';
import * as diceUtils from '../utils/dice.js';

export default function LastBreathModal({ isOpen, onClose, rollDie }) {
  const [roll, setRoll] = useState(null);
  if (!isOpen) return null;

  const handleRoll = () => {
    const total = rollDie(6) + rollDie(6);
    let message;
    if (total >= 10) message = 'You survive by sheer will!';
    else if (total >= 7) message = 'Death offers a bargain.';
    else message = 'Your time has come.';
    setRoll({ total, message });
  };

  return (
    <div role="dialog">
      <h2>
        <FaSkull /> Last Breath
      </h2>
      {roll ? (
        <>
          <div>2d6: {roll.total}</div>
          <div>{roll.message}</div>
        </>
      ) : (
        <button onClick={handleRoll}>Roll</button>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

LastBreathModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rollDie: PropTypes.func,
};

LastBreathModal.defaultProps = {
  rollDie: diceUtils.rollDie,
};
