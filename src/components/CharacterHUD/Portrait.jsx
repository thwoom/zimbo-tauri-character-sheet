import React from 'react';
import { useCharacter } from '../../state/CharacterContext.jsx';
import useStatusEffects from '../../hooks/useStatusEffects.js';
import styles from './Portrait.module.css';

export default function Portrait() {
  const { character } = useCharacter();
  const { getStatusEffectImage, getActiveVisualEffects } = useStatusEffects(character, () => {});
  return (
    <div className={`${styles.avatarContainer} ${getActiveVisualEffects()}`}>
      <img src={getStatusEffectImage()} alt="Character portrait" className={styles.avatar} />
    </div>
  );
}
