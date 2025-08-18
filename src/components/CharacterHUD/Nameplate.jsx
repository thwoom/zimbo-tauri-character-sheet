import React from 'react';
import { useCharacter } from '../../state/CharacterContext';

export default function Nameplate() {
  const { character } = useCharacter();
  return <div className="font-bold text-center">{character.name || 'Unnamed Adventurer'}</div>;
}
