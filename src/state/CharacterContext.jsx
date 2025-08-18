import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { INITIAL_CHARACTER_DATA } from './character';
import { saveFile, loadFile } from '../utils/fileStorage.js';
import cloneDeep from '../utils/cloneDeep.js';
import safeLocalStorage from '../utils/safeLocalStorage.js';

const STORAGE_FILE = 'character.json';

const createDefaultCharacter = () => cloneDeep(INITIAL_CHARACTER_DATA);

const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState(createDefaultCharacter);
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
    const json = JSON.stringify(character);
    saveFile(STORAGE_FILE, json).catch((error) => {
      console.error('Failed to save character file:', error);
    });
    try {
      const existing = safeLocalStorage.getItem('characterVersions');
      const versions = existing ? JSON.parse(existing) : [];
      const last = versions[0];
      const current = { id: Date.now(), timestamp: new Date().toISOString(), character };
      const lastJson = last ? JSON.stringify(last.character) : null;
      if (lastJson !== json) {
        const next = [current, ...versions].slice(0, 10);
        safeLocalStorage.setItem('characterVersions', JSON.stringify(next));
      }
    } catch (_) {
      // ignore versioning failures
    }
  }, [character]);

  const value = useMemo(() => ({ character, setCharacter }), [character]);
  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacter = () => useContext(CharacterContext);

export default CharacterContext;
