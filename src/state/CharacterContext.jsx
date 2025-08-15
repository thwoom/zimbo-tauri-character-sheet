import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { INITIAL_CHARACTER_DATA } from './character';

const CharacterContext = createContext();

const createDefaultCharacter = () => ({ id: crypto.randomUUID(), ...INITIAL_CHARACTER_DATA });

export const CharacterProvider = ({ children }) => {
  const [characters, setCharacters] = useState([createDefaultCharacter()]);
  const [selectedId, setSelectedId] = useState(characters[0].id);

  const character = useMemo(
    () => characters.find((c) => c.id === selectedId),
    [characters, selectedId],
  );

  const setCharacter = useCallback(
    (update) => {
      setCharacters((prev) =>
        prev.map((c) => {
          if (c.id !== selectedId) return c;
          const updated = typeof update === 'function' ? update(c) : update;
          return { ...updated, id: selectedId };
        }),
      );
    },
    [selectedId],
  );

  const addCharacter = useCallback((char) => {
    const id = char.id || crypto.randomUUID();
    setCharacters((prev) => [...prev, { ...char, id }]);
    setSelectedId(id);
  }, []);

  const value = useMemo(
    () => ({
      characters,
      selectedId,
      setSelectedId,
      character,
      setCharacter,
      addCharacter,
    }),
    [characters, selectedId, character, setCharacter, addCharacter],
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacter = () => useContext(CharacterContext);

export default CharacterContext;
