import { render, fireEvent, screen } from '@testing-library/react';
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

describe('LevelUpModal XP calculation', () => {
  it('sets xpNeeded to level + 7 after leveling', () => {
    let character = {
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
      maxHp: 10,
      hp: 10,
      xp: 8,
      xpNeeded: 8,
      selectedMoves: [],
      actionHistory: [],
    };

    const levelUpState = {
      selectedStats: ['STR'],
      selectedMove: 'appetite',
      hpIncrease: 1,
      newLevel: 2,
      expandedMove: '',
    };

    const setCharacter = (fn) => {
      character = fn(character);
    };

    render(
      <LevelUpModal
        character={character}
        setCharacter={setCharacter}
        levelUpState={levelUpState}
        setLevelUpState={() => {}}
        onClose={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
      />,
    );

    const completeButton = screen.getByRole('button', { name: /Complete Level Up/i });
    fireEvent.click(completeButton);

    expect(character.xpNeeded).toBe(levelUpState.newLevel + 7);
  });
});
