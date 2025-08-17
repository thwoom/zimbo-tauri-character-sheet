import React, { useEffect } from 'react';
import Nameplate from './Nameplate';
import Portrait from './Portrait';
import ResourceBars from './ResourceBars';
import StatusTray from './StatusTray';
import CastIndicator from './CastIndicator';
import styles from './CharacterHUD.module.css';
import { useCharacter } from '../../state/CharacterContext';

export default function CharacterHUD({ onMountChange = () => {} }) {
  const { character } = useCharacter();

  useEffect(() => {
    onMountChange(true);
    return () => onMountChange(false);
  }, [onMountChange]);

  return (
    <div className={styles.hud}>
      <Nameplate />
      <Portrait />
      <ResourceBars
        primary={{ current: character.hp, max: character.maxHp }}
        secondary={
          character.maxSecondaryResource > 0
            ? {
                current: character.secondaryResource,
                max: character.maxSecondaryResource,
              }
            : null
        }
        shield={character.shield > 0 ? { current: character.shield, max: character.maxHp } : null}
      />
      <StatusTray />
      <CastIndicator />
    </div>
  );
}
