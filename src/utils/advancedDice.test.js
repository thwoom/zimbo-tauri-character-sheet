// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AdvancedDiceParser,
  getDiceExamples,
  isValidFormula,
  rollAdvancedDice,
} from './advancedDice.js';

beforeEach(() => {
  vi.stubEnv('MODE', 'test');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('AdvancedDiceParser', () => {
  let parser;

  beforeEach(() => {
    parser = new AdvancedDiceParser();
  });

  describe('Basic Compatibility', () => {
    it('handles standard dice expressions', () => {
      const result = parser.parse('2d6+3');
      expect(result.total).toBeGreaterThanOrEqual(5); // 2d6+3 minimum is 5
      expect(result.total).toBeLessThanOrEqual(15); // 2d6+3 maximum is 15
      expect(result.rolls).toHaveLength(2);
      expect(result.rolls.every((r) => r >= 1 && r <= 6)).toBe(true);
      expect(result.breakdown).toContain('Modifier: +3');
    });

    it('handles single die expressions', () => {
      const result = parser.parse('d8');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(8);
      expect(result.rolls).toHaveLength(1);
      expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
      expect(result.rolls[0]).toBeLessThanOrEqual(8);
    });
  });

  describe('Keep Highest/Lowest', () => {
    it('keeps highest dice correctly', () => {
      const result = parser.parse('3d6 keep highest 2');
      expect(result.total).toBeGreaterThanOrEqual(3); // minimum: 1+2
      expect(result.total).toBeLessThanOrEqual(12); // maximum: 6+6
      expect(result.rolls).toHaveLength(3);
      expect(result.details.kept).toHaveLength(2);
      expect(result.details.dropped).toHaveLength(1);
      expect(result.details.keepType).toBe('highest');
      expect(result.details.keepCount).toBe(2);
      expect(result.breakdown).toContain('highest 2:');
    });

    it('keeps lowest dice correctly', () => {
      const result = parser.parse('3d6 keep lowest 2');
      expect(result.total).toBeGreaterThanOrEqual(3); // minimum: 1+2
      expect(result.total).toBeLessThanOrEqual(12); // maximum: 6+6
      expect(result.rolls).toHaveLength(3);
      expect(result.details.kept).toHaveLength(2);
      expect(result.details.dropped).toHaveLength(1);
      expect(result.details.keepType).toBe('lowest');
      expect(result.details.keepCount).toBe(2);
      expect(result.breakdown).toContain('lowest 2:');
    });

    it('handles keep with modifiers', () => {
      const result = parser.parse('3d6 keep highest 2+1');
      expect(result.total).toBeGreaterThanOrEqual(4); // minimum: (1+2)+1
      expect(result.total).toBeLessThanOrEqual(13); // maximum: (6+6)+1
      expect(result.rolls).toHaveLength(3);
      expect(result.details.kept).toHaveLength(2);
      expect(result.breakdown).toContain('Modifier: +1');
    });
  });

  describe('Exploding Dice', () => {
    it('handles exploding dice correctly', () => {
      const result = parser.parse('d6!');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.rolls.length).toBeGreaterThanOrEqual(1);
      expect(result.rolls.every((r) => r >= 1 && r <= 6)).toBe(true);
      // Note: exploding dice can have multiple rolls, so we can't predict exact length
    });

    it('handles multiple exploding dice', () => {
      const result = parser.parse('2d6!');
      expect(result.total).toBeGreaterThanOrEqual(2); // minimum: 1+1
      expect(result.rolls.length).toBeGreaterThanOrEqual(2); // at least 2 dice (can be more due to explosions)
      expect(result.rolls.every((r) => r >= 1 && r <= 6)).toBe(true);
    });
  });

  describe('Dice Pools (Count Successes)', () => {
    it('counts successes correctly', () => {
      const result = parser.parse('5d6 count 4+');
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(5);
      expect(result.rolls).toHaveLength(5);
      expect(result.details.successes).toBe(result.total);
      expect(result.details.threshold).toBe(4);
      expect(result.breakdown).toContain('Successes (4+):');
    });

    it('handles edge case with no successes', () => {
      const result = parser.parse('3d6 count 4+');
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(3);
      expect(result.rolls).toHaveLength(3);
      expect(result.details.successes).toBe(result.total);
      expect(result.details.threshold).toBe(4);
    });
  });

  describe('Advantage/Disadvantage', () => {
    it('handles advantage correctly', () => {
      const result = parser.parse('2d20 advantage');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(20);
      expect(result.rolls).toHaveLength(2);
      expect(result.details.advantageType).toBe('advantage');
      expect(result.details.selected).toBe(result.total);
      expect(result.breakdown).toContain('advantage:');
    });

    it('handles disadvantage correctly', () => {
      const result = parser.parse('2d20 disadvantage');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(20);
      expect(result.rolls).toHaveLength(2);
      expect(result.details.advantageType).toBe('disadvantage');
      expect(result.details.selected).toBe(result.total);
      expect(result.breakdown).toContain('disadvantage:');
    });

    it('throws error for non-2 dice advantage', () => {
      expect(() => parser.parse('3d20 advantage')).toThrow(
        'Advantage/disadvantage requires exactly 2 dice',
      );
    });
  });

  describe('Complex Combinations', () => {
    it('handles keep highest with exploding dice', () => {
      const result = parser.parse('2d6! keep highest 1');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(6);
      expect(result.rolls.length).toBeGreaterThanOrEqual(2); // at least 2 dice (can be more due to explosions)
      expect(result.details.kept).toHaveLength(1);
      expect(result.details.keepType).toBe('highest');
      expect(result.details.keepCount).toBe(1);
    });
  });

  describe('Validation', () => {
    it('validates keep count', () => {
      expect(() => parser.parse('2d6 keep highest 3')).toThrow(
        'keep count must be between 1 and dice count',
      );
      expect(() => parser.parse('2d6 keep highest 0')).toThrow(
        'keep count must be between 1 and dice count',
      );
    });

    it('validates count threshold', () => {
      expect(() => parser.parse('2d6 count 7+')).toThrow(
        'count threshold must be between 1 and dice sides',
      );
      expect(() => parser.parse('2d6 count 0+')).toThrow(
        'count threshold must be between 1 and dice sides',
      );
    });

    it('validates dice count', () => {
      expect(() => parser.parse('0d6')).toThrow('count must be a positive integer');
      expect(() => parser.parse('1001d6')).toThrow('count must not exceed 1000');
    });

    it('validates dice sides', () => {
      expect(() => parser.parse('2d0')).toThrow('sides must be a positive integer');
    });
  });

  describe('Formatting', () => {
    it('formats results correctly', () => {
      const result = parser.parse('2d6 keep highest 1+3');
      expect(result.formula).toContain('keep highest 1');
      expect(result.formula).toContain('+3');
      expect(result.formula).toContain('=');
      expect(result.details.kept).toHaveLength(1);
      expect(result.details.keepType).toBe('highest');
      expect(result.details.keepCount).toBe(1);
    });
  });
});

describe('rollAdvancedDice', () => {
  it('provides convenience function', () => {
    const result = rollAdvancedDice('d6');
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.total).toBeLessThanOrEqual(6);
    expect(result.rolls).toHaveLength(1);
    expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
    expect(result.rolls[0]).toBeLessThanOrEqual(6);
  });
});

describe('getDiceExamples', () => {
  it('returns array of examples', () => {
    const examples = getDiceExamples();
    expect(Array.isArray(examples)).toBe(true);
    expect(examples.length).toBeGreaterThan(0);
    expect(examples[0]).toHaveProperty('formula');
    expect(examples[0]).toHaveProperty('description');
  });

  it('includes all supported features', () => {
    const examples = getDiceExamples();
    const formulas = examples.map((e) => e.formula);

    expect(formulas).toContain('3d6 keep highest 2');
    expect(formulas).toContain('d6!');
    expect(formulas).toContain('5d6 count 4+');
    expect(formulas).toContain('2d20 advantage');
    expect(formulas).toContain('2d20 disadvantage');
  });
});

describe('isValidFormula', () => {
  it('returns true for advanced formulas', () => {
    expect(isValidFormula('3d6 keep highest 2')).toBe(true);
    expect(isValidFormula('d6!')).toBe(true);
    expect(isValidFormula('5d6 count 4+')).toBe(true);
    expect(isValidFormula('2d20 advantage')).toBe(true);
    expect(isValidFormula('2d20 disadvantage')).toBe(true);
  });

  it('returns false for basic formulas', () => {
    expect(isValidFormula('2d6+3')).toBe(false);
    expect(isValidFormula('d6')).toBe(false);
    expect(isValidFormula('3d8')).toBe(false);
  });

  it('returns false for invalid formulas', () => {
    expect(isValidFormula('invalid')).toBe(false);
    expect(isValidFormula('2d')).toBe(false);
    expect(isValidFormula('d')).toBe(false);
    expect(isValidFormula('2d6 keep highest 10')).toBe(false);
  });
});
