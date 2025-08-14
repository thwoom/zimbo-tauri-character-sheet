import React from 'react';
import Nameplate from './Nameplate.jsx';
import Portrait from './Portrait.jsx';
import ResourceBars from './ResourceBars.jsx';
import StatusTray from './StatusTray.jsx';
import CastIndicator from './CastIndicator.jsx';
import styles from './CharacterHUD.module.css';

export default function CharacterHUD() {
  return (
    <div className={styles.hud}>
      <Nameplate />
      <Portrait />
      <ResourceBars />
      <StatusTray />
      <CastIndicator />
    </div>
  );
}
