import React, { useEffect } from 'react';
import Nameplate from './Nameplate';
import Portrait from './Portrait';
import ResourceBars from './ResourceBars';
import StatusTray from './StatusTray';
import CastIndicator from './CastIndicator';
import { useCharacter } from '../../state/CharacterContext';
import Card from '../ui/Card';

export default function CharacterHUD({ onMountChange = () => {} }) {
  const { character } = useCharacter();

  useEffect(() => {
    onMountChange(true);
    return () => onMountChange(false);
  }, [onMountChange]);

  return (
    <Card className="flex flex-col items-center gap-sm">
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
    </Card>
  );
}
