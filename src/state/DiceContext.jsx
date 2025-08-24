import React, { createContext, useContext, useState } from 'react';

const DiceContext = createContext();

export const useDice = () => {
  const context = useContext(DiceContext);
  if (!context) {
    throw new Error('useDice must be used within a DiceProvider');
  }
  return context;
};

export const DiceProvider = ({ children }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [showDiceInHUD, setShowDiceInHUD] = useState(false);

  const startRoll = () => {
    setIsRolling(true);
    setShowDiceInHUD(true);
    setDiceResult(null);
  };

  const endRoll = (result) => {
    setIsRolling(false);
    setDiceResult(result);
    
    // Keep dice visible for a moment to show result
    setTimeout(() => {
      setShowDiceInHUD(false);
      setDiceResult(null);
    }, 2000);
  };

  const value = {
    isRolling,
    diceResult,
    showDiceInHUD,
    startRoll,
    endRoll,
  };

  return <DiceContext.Provider value={value}>{children}</DiceContext.Provider>;
};
