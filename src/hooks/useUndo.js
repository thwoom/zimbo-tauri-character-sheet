import { useRef, useEffect } from 'react';
import cloneDeep from '../utils/cloneDeep.js';

export default function useUndo(character, setCharacter, setRollResult) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const saveToHistory = (action) => {
    setCharacter((prev) => ({
      ...prev,
      actionHistory: [
        { action, state: cloneDeep(prev), timestamp: Date.now() },
        ...prev.actionHistory.slice(0, 4),
      ],
    }));
  };

  const undoLastAction = () => {
    if (character.actionHistory.length > 0) {
      const lastAction = character.actionHistory[0];
      setCharacter(cloneDeep(lastAction.state));
      if (setRollResult) {
        setRollResult(`\u21B6 Undid: ${lastAction.action}`);
        timeoutRef.current = setTimeout(() => setRollResult('Ready to roll!'), 2000);
      }
    }
  };

  return {
    actionHistory: character.actionHistory,
    saveToHistory,
    undoLastAction,
  };
}
