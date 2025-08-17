import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import styles from './Nameplate.module.css';

export default function Nameplate() {
  const { character } = useCharacter();
  return <div className={styles.name}>{character.name || 'Unnamed Adventurer'}</div>;
}
