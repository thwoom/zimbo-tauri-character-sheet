import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { advancedMoves } from '../data/advancedMoves.js';
import LevelUpModal from './LevelUpModal.jsx';

describe('LevelUpModal advanced moves', () => {
  it('renders moves from data file', () => {
    const character = {
      name: 'Test',
      level: 1,
      stats: {
        STR: { score: 10, mod: 0 },
        DEX: { score: 10, mod: 0 },
        CON: { score: 10, mod: 0 },
        INT: { score: 10, mod: 0 },
        WIS: { score: 10, mod: 0 },
        CHA: { score: 10, mod: 0 },
      },
      selectedMoves: [],
    };

    const levelUpState = {
      selectedStats: [],
      selectedMove: '',
      hpIncrease: 0,
      newLevel: 2,
      expandedMove: '',
    };

    const html = renderToStaticMarkup(
      <LevelUpModal
        character={character}
        setCharacter={() => {}}
        levelUpState={levelUpState}
        setLevelUpState={() => {}}
        onClose={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
      />,
    );

    expect(html).toContain(advancedMoves.appetite.name);
  });
});
