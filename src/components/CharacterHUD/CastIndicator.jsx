import React from 'react';
import { useCharacter } from '../../state/CharacterContext.jsx';
import styles from './CastIndicator.module.css';

export default function CastIndicator() {
  const { character } = useCharacter();
  const { castName, castProgress } = character;
  if (!castName) return null;
  return (
    <div className={styles.container}>
      <span>{castName}</span>
      {typeof castProgress === 'number' && <progress value={castProgress} max="100" />}
    </div>
  );
}
