import React from 'react';
import useStatusEffects from '../hooks/useStatusEffects.js';
import styles from './CharacterAvatar.module.css';

export default function CharacterAvatar({ character }) {
  const { getStatusEffectImage, getActiveVisualEffects } = useStatusEffects(character, () => {});

  return (
    <div className={`${styles.avatarContainer} ${getActiveVisualEffects()}`}>
      <img src={getStatusEffectImage()} alt="Character avatar" className={styles.avatar} />
    </div>
  );
}
