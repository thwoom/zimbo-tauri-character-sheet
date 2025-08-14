import React from 'react';
import { useCharacter } from '../../state/CharacterContext.jsx';
import styles from './ResourceBars.module.css';

export default function ResourceBars() {
  const { character } = useCharacter();
  const { hp, maxHp, secondaryResource = 0, maxSecondaryResource = 0, shield = 0 } = character;
  return (
    <div className={styles.container}>
      <div className={styles.bar}>{`HP: ${hp}/${maxHp}`}</div>
      {maxSecondaryResource > 0 && (
        <div className={styles.bar}>{`Resource: ${secondaryResource}/${maxSecondaryResource}`}</div>
      )}
      {shield > 0 && <div className={styles.bar}>{`Shield: ${shield}`}</div>}
    </div>
  );
}
