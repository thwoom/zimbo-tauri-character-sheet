import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { statusEffectTypes } from '../../state/character.js';
import Toolbar from '../ui/Toolbar';

export default function StatusTray() {
  const { character } = useCharacter();
  return (
    <Toolbar className="justify-center flex-wrap">
      {character.statusEffects?.map((effect) => {
        const Icon = statusEffectTypes[effect]?.icon;
        return (
          <span key={effect} title={statusEffectTypes[effect]?.name} className="inline-flex">
            {Icon && <Icon />}
          </span>
        );
      })}
    </Toolbar>
  );
}
