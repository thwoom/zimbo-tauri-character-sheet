import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import useStatusEffects from '../../hooks/useStatusEffects.js';
import styles from './Portrait.module.css';

export default function Portrait() {
  const { character } = useCharacter();
  const { getStatusEffectImage, getActiveVisualEffects } = useStatusEffects(character, () => {});
  return (
    <div className={`${styles.avatarContainer} ${getActiveVisualEffects()}`}>
      <img
        src={getStatusEffectImage()}
        alt="Character avatar"
        className={styles.avatar}
        tabIndex={2}
      />
    </div>
  );
}
