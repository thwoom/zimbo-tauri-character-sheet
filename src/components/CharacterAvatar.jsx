import React from 'react';
import useStatusEffects from '../hooks/useStatusEffects.js';
import styles from './CharacterAvatar.module.css';

export default function CharacterAvatar({ character }) {
  const { getStatusEffectImage, getActiveVisualEffects } = useStatusEffects(character, () => {});

  return (
    <div className={`${styles.avatarContainer} ${getActiveVisualEffects()}`}>
      {/* eslint-disable-next-line jsx-a11y/tabindex-no-positive */}
      <img
        src={getStatusEffectImage()}
        alt="Character avatar"
        tabIndex={2}
        className={styles.avatar}
      />
    </div>
  );
}
