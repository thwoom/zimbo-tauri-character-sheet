import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import useStatusEffects from '../../hooks/useStatusEffects.js';
import Panel from '../ui/Panel';

export default function Portrait() {
  const { character } = useCharacter();
  const { getStatusEffectImage, getActiveVisualEffects } = useStatusEffects(character, () => {});
  return (
    <Panel className={`flex justify-center ${getActiveVisualEffects()}`}>
      <img
        src={getStatusEffectImage()}
        alt="Character avatar"
        className="w-full max-w-xs rounded-full border-2 border-accent"
        tabIndex={2}
      />
    </Panel>
  );
}
