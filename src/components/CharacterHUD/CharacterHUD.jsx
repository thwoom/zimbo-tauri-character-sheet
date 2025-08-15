import React, { useEffect } from 'react';
import Nameplate from './Nameplate.jsx';
import Portrait from './Portrait.jsx';
import ResourceBars from './ResourceBars.jsx';
import StatusTray from './StatusTray.jsx';
import CastIndicator from './CastIndicator.jsx';
import styles from './CharacterHUD.module.css';
import { useCharacter } from '../../state/CharacterContext.jsx';

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
        secondary={{
          current: character.secondaryResource,
          max: character.maxSecondaryResource,
        }}
        shield={{ current: character.shield, max: character.maxHp }}
      />
      <StatusTray />
      <CastIndicator />
    </div>
  );
}
