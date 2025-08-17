import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { statusEffectTypes } from '../../state/character.js';
import styles from './StatusTray.module.css';

export default function StatusTray() {
  const { character } = useCharacter();
  return (
    <div className={styles.container}>
      {character.statusEffects?.map((effect) => {
        const Icon = statusEffectTypes[effect]?.icon;
        return (
          <span key={effect} title={statusEffectTypes[effect]?.name} className={styles.icon}>
            {Icon && <Icon />}
          </span>
        );
      })}
    </div>
  );
}
