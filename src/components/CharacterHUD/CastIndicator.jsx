import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import Toolbar from '../ui/Toolbar';

export default function CastIndicator() {
  const { character } = useCharacter();
  const { castName, castProgress } = character;
  if (!castName) return null;
  return (
    <Toolbar className="justify-center text-center">
      <span>{castName}</span>
      {typeof castProgress === 'number' && <progress value={castProgress} max="100" />}
    </Toolbar>
  );
}
