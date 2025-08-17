import React from 'react';
import { useCharacter } from '../state/CharacterContext';

export default function CharacterSwitcher() {
  const ctx = useCharacter();
  if (!ctx?.characters || !ctx?.setSelectedId || ctx.selectedId === undefined) return null;
  const { characters, selectedId, setSelectedId } = ctx;
  return (
    <select
      value={selectedId}
      onChange={(e) => setSelectedId(e.target.value)}
      aria-label="Select character"
    >
      {characters.map((c, idx) => (
        <option key={c.id} value={c.id}>
          {c.name || `Character ${idx + 1}`}
        </option>
      ))}
    </select>
  );
}
