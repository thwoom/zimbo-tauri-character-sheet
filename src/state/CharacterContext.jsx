import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { INITIAL_CHARACTER_DATA } from './character';
import { saveFile, loadFile } from '../utils/fileStorage.js';

const STORAGE_FILE = 'character.json';

const CharacterContext = createContext();

const createDefaultCharacter = () => ({ id: crypto.randomUUID(), ...INITIAL_CHARACTER_DATA });

export const CharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState(INITIAL_CHARACTER_DATA);
  const initializedRef = useRef(false);

  useEffect(() => {
    loadFile(STORAGE_FILE)
      .then((data) => {
        if (data) {
          try {
            setCharacter(JSON.parse(data));
            return;
          } catch (error) {
            console.error('Failed to parse character file:', error);
          }
        }
        setCharacter(createDefaultCharacter());
      })
      .catch((error) => {
        console.error('Failed to load character file:', error);
        setCharacter(createDefaultCharacter());
      })
      .finally(() => {
        initializedRef.current = true;
      });
  }, []);

  useEffect(() => {
    if (!initializedRef.current) return;
    saveFile(STORAGE_FILE, JSON.stringify(character)).catch((error) => {
      console.error('Failed to save character file:', error);
    });
  }, [character]);

  const value = useMemo(() => ({ character, setCharacter }), [character]);
  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacter = () => useContext(CharacterContext);

export default CharacterContext;
