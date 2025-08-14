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
        role="img"
        aria-label="Character avatar"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        viewBox="0 0 64 64"
      >
        <defs>
          <radialGradient id="lowHpGradient">
            <stop offset="0%" stopColor="rgba(255,0,0,0.4)" />
            <stop offset="70%" stopColor="transparent" />
          </radialGradient>
          <filter id="desaturate">
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <pattern id="hexPattern" width="10" height="8.66" patternUnits="userSpaceOnUse">
            <path
              d="M5 0l5 2.89v5.77l-5 2.89-5-2.89V2.89z"
              fill="none"
              stroke="rgba(0,255,255,0.6)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <g className={styles.silhouette}>
          <path d="M32 4c-9 0-16 7-16 16 0 7 4 13 10 15-4 1-7 4-9 8-2 4-3 9-3 14h36c0-5-1-10-3-14-2-4-5-7-9-8 6-2 10-8 10-15 0-9-7-16-16-16z" />
        </g>
        <g className={styles.lowHpLayer}>
          <circle cx="32" cy="32" r="30" fill="url(#lowHpGradient)" />
        </g>
        <g className={styles.shieldLayer}>
          <circle cx="32" cy="32" r="30" fill="url(#hexPattern)" />
        </g>
      </svg>
    </div>
  );
}
