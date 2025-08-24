import { createContext, useContext, useMemo, useState } from 'react';
import { INITIAL_CHARACTER_DATA } from '../state/character';
import cloneDeep from '../utils/cloneDeep.js';

const createDefaultCharacter = () => cloneDeep(INITIAL_CHARACTER_DATA);

const SimpleCharacterContext = createContext();

export const SimpleCharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState(createDefaultCharacter);

  const value = useMemo(() => ({ character, setCharacter }), [character]);
  return (
    <SimpleCharacterContext.Provider value={value}>{children}</SimpleCharacterContext.Provider>
  );
};

export const useSimpleCharacter = () => useContext(SimpleCharacterContext);

export default SimpleCharacterContext;

