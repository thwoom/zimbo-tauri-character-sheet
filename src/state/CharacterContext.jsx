import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_CHARACTER_DATA } from './character';

const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState(INITIAL_CHARACTER_DATA);
  const value = useMemo(() => ({ character, setCharacter }), [character]);
  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacter = () => useContext(CharacterContext);

export default CharacterContext;
