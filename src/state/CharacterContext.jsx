import React, { createContext, useContext, useState } from 'react';
import { INITIAL_CHARACTER_DATA } from './character';

const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState(INITIAL_CHARACTER_DATA);
  return (
    <CharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => useContext(CharacterContext);

export default CharacterContext;
