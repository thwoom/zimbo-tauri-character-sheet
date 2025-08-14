import React from 'react';
import styles from './index.module.css';

export const LOW_HP_THRESHOLD = 0.3;

export default function CharacterHUD({
  isCasting = false,
  castPercent = 0,
  hp = 0,
  maxHp = 0,
  effects = [],
}) {
  const classes = [];

  if (isCasting) {
    classes.push(styles.casting);
    classes.push(castPercent >= 100 ? styles.castComplete : styles.castProgress);
  }

  if (maxHp > 0 && hp / maxHp < LOW_HP_THRESHOLD) {
    classes.push(styles.lowHp);
  }

  const effectClassMap = {
    poisoned: styles.effectPoisoned,
    burning: styles.effectBurning,
    shocked: styles.effectShocked,
    frozen: styles.effectFrozen,
    blessed: styles.effectBlessed,
  };

  effects.forEach((effect) => {
    const cls = effectClassMap[effect];
    if (cls) classes.push(cls);
  });

  const className = [styles.hud, ...classes].join(' ');

  return (
    <div data-testid="hud" className={className} style={{ '--cast-percent': castPercent }}>
      <svg className={styles.svg} viewBox="0 0 100 100">
        <circle className={styles.health} cx="50" cy="50" r="45" />
        <circle className={styles.castBar} cx="50" cy="50" r="40" />
      </svg>
    </div>
  );
}
