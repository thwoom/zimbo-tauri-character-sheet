/* eslint-env jest */
import { describe, expect, it } from 'vitest';
import {
  classes,
  getAvailableMoves,
  getClass,
  getClassNames,
  getClassTemplate,
  getSelectableMoves,
} from './index';

describe('Class data and helpers', () => {
  it('exposes all 10 core classes', () => {
    const names = getClassNames();
    expect(names.sort()).toEqual(
      [
        'barbarian',
        'bard',
        'cleric',
        'druid',
        'fighter',
        'immolator',
        'paladin',
        'ranger',
        'thief',
        'wizard',
      ].sort(),
    );
    // Ensure each maps to an object with a template and moves
    names.forEach((name) => {
      const data = getClass(name);
      expect(data).toBeTruthy();
      expect(data.template).toBeTruthy();
      expect(Array.isArray(data.startingMoves)).toBe(true);
      expect(Array.isArray(data.advancedMoves)).toBe(true);
    });
    // Classes object should include keys for all
    expect(Object.keys(classes).sort()).toEqual(names.sort());
  });

  it('produces a usable class template with class and className', () => {
    const t = getClassTemplate('fighter');
    expect(t).toBeTruthy();
    expect(t.class).toBe('fighter');
    expect(t.className).toBe('Fighter');
    // Contains core fields
    expect(typeof t.level).toBe('number');
    expect(typeof t.hp).toBe('number');
    expect(t.stats).toBeTruthy();
    expect(t.inventory).toBeTruthy();
  });

  it('includes starting moves and level-appropriate advanced moves', () => {
    // Level 1: only starting moves
    const lvl1 = getAvailableMoves('fighter', 1);
    const fighter = getClass('fighter');
    expect(lvl1).toEqual(fighter.startingMoves);

    // Level 3: includes starting + any advanced with level <= 3
    const lvl3 = getAvailableMoves('thief', 3);
    const thief = getClass('thief');
    const expected = [...thief.startingMoves, ...thief.advancedMoves.filter((m) => m.level <= 3)];
    // Compare by ids to avoid deep equal ordering sensitivity
    expect(lvl3.map((m) => m.id).sort()).toEqual(expected.map((m) => m.id).sort());
  });

  it('filters selectable moves to those not yet chosen and within level', () => {
    const level = 3;
    const already = ['flexible_morals'];
    const selectable = getSelectableMoves('thief', level, already);
    expect(selectable.every((m) => m.level <= level)).toBe(true);
    expect(selectable.find((m) => m.id === 'flexible_morals')).toBeUndefined();
  });
});
