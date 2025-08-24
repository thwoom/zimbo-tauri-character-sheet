/**
 * Advanced Dice Parser for complex dice expressions
 * Supports: keep highest/lowest, exploding dice, dice pools, advantage/disadvantage
 */
export class AdvancedDiceParser {
  constructor() {
    this.random = Math.random;
  }

  /**
   * Parse and roll a dice expression
   * @param {string} formula - Dice formula to parse
   * @returns {Object} Roll result with total, rolls, breakdown, etc.
   */
  parse(formula) {
    const trimmed = formula.trim();

    // Parse basic dice expression (e.g., "2d6", "d8")
    const basicMatch = trimmed.match(/^(\d*)d(\d+)/);
    if (!basicMatch) {
      throw new Error('Invalid dice formula');
    }

    const count = basicMatch[1] ? parseInt(basicMatch[1]) : 1;
    const sides = parseInt(basicMatch[2]);

    // Validate dice count and sides
    if (count <= 0) throw new Error('count must be a positive integer');
    if (count > 1000) throw new Error('count must not exceed 1000');
    if (sides <= 0) throw new Error('sides must be a positive integer');

    // Parse modifiers and special features
    const remaining = trimmed.substring(basicMatch[0].length);
    
    // Parse keep highest/lowest
    const keepMatch = remaining.match(/keep\s+(highest|lowest)\s+(\d+)/i);
    const keepType = keepMatch ? keepMatch[1].toLowerCase() : null;
    const keepCount = keepMatch ? parseInt(keepMatch[2]) : null;

    // Parse exploding dice
    const isExploding = remaining.includes('!');

    // Parse count successes
    const countMatch = remaining.match(/count\s+(\d+)\+/i);
    const countThreshold = countMatch ? parseInt(countMatch[1]) : null;

    // Parse advantage/disadvantage
    const advantageMatch = remaining.match(/(advantage|disadvantage)/i);
    const advantageType = advantageMatch ? advantageMatch[1].toLowerCase() : null;

    // Parse modifier (look for it anywhere in the remaining string)
    const modifierMatch = remaining.match(/([+-]\d+)/);
    const modifier = modifierMatch ? parseInt(modifierMatch[1]) : 0;

    // Validate keep count
    if (keepCount !== null) {
      if (keepCount <= 0 || keepCount > count) {
        throw new Error('keep count must be between 1 and dice count');
      }
    }

    // Validate count threshold
    if (countThreshold !== null) {
      if (countThreshold <= 0 || countThreshold > sides) {
        throw new Error('count threshold must be between 1 and dice sides');
      }
    }

    // Validate advantage/disadvantage
    if (advantageType && count !== 2) {
      throw new Error('Advantage/disadvantage requires exactly 2 dice');
    }

    // Roll the dice
    let rolls = [];
    if (isExploding) {
      rolls = this.rollExplodingDice(count, sides);
    } else {
      rolls = this.rollDice(count, sides);
    }

    let total = 0;
    let details = {};

    // Handle different roll types
    if (countThreshold !== null) {
      // Dice pool - count successes
      const successes = rolls.filter((roll) => roll >= countThreshold).length;
      total = successes;
      details = {
        successes,
        threshold: countThreshold,
        rolls,
      };
    } else if (advantageType) {
      // Advantage/disadvantage
      const selected = advantageType === 'advantage' ? Math.max(...rolls) : Math.min(...rolls);
      total = selected;
      details = {
        advantageType,
        selected,
        rolls,
      };
    } else if (keepType) {
      // Keep highest/lowest
      const sorted = [...rolls].sort((a, b) => (keepType === 'highest' ? b - a : a - b));
      const kept = sorted.slice(0, keepCount);
      const dropped = sorted.slice(keepCount);
      total = kept.reduce((sum, roll) => sum + roll, 0);
      details = {
        kept,
        dropped,
        keepType,
        keepCount,
        rolls,
      };
    } else {
      // Standard roll
      total = rolls.reduce((sum, roll) => sum + roll, 0);
      details = { rolls };
    }

    // Add modifier
    total += modifier;

    // Build breakdown
    const breakdown = this.buildBreakdown(formula, rolls, total, details, modifier);

    return {
      total,
      rolls,
      details,
      breakdown,
      formula: `${formula} = ${total}`,
    };
  }

  /**
   * Roll standard dice
   */
  rollDice(count, sides) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(this.random() * sides) + 1);
    }
    return rolls;
  }

  /**
   * Roll exploding dice
   */
  rollExplodingDice(count, sides) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
      let roll = Math.floor(this.random() * sides) + 1;
      rolls.push(roll);

      // Keep rolling if we got the maximum value
      while (roll === sides) {
        roll = Math.floor(this.random() * sides) + 1;
        rolls.push(roll);
      }
    }
    return rolls;
  }

  /**
   * Build a human-readable breakdown of the roll
   */
  buildBreakdown(formula, rolls, total, details, modifier) {
    let breakdown = `Rolls: [${rolls.join(', ')}]`;

    if (details.successes !== undefined) {
      breakdown += `\nSuccesses (${details.threshold}+): ${details.successes}`;
    } else if (details.advantageType) {
      breakdown += `\n${details.advantageType}: ${details.selected}`;
    } else if (details.kept) {
      breakdown += `\n${details.keepType} ${details.keepCount}: [${details.kept.join(', ')}]`;
      if (details.dropped.length > 0) {
        breakdown += `\nDropped: [${details.dropped.join(', ')}]`;
      }
    }

    if (modifier !== 0) {
      breakdown += `\nModifier: ${modifier > 0 ? '+' : ''}${modifier}`;
    }

    return breakdown;
  }
}

/**
 * Convenience function to roll advanced dice
 * @param {string} formula - Dice formula
 * @returns {Object} Roll result
 */
export function rollAdvancedDice(formula) {
  const parser = new AdvancedDiceParser();
  return parser.parse(formula);
}

/**
 * Get examples of supported dice formulas
 * @returns {Array} Array of example objects with formula and description
 */
export function getDiceExamples() {
  return [
    {
      formula: '3d6 keep highest 2',
      description: 'Roll 3d6, keep the 2 highest',
    },
    {
      formula: '3d6 keep lowest 2',
      description: 'Roll 3d6, keep the 2 lowest',
    },
    {
      formula: 'd6!',
      description: 'Roll 1d6 with explosions on max',
    },
    {
      formula: '2d6!',
      description: 'Roll 2d6 with explosions on max',
    },
    {
      formula: '5d6 count 4+',
      description: 'Roll 5d6, count successes (4+)',
    },
    {
      formula: '2d20 advantage',
      description: 'Roll 2d20, take highest',
    },
    {
      formula: '2d20 disadvantage',
      description: 'Roll 2d20, take lowest',
    },
    {
      formula: '3d6 keep highest 2+1',
      description: 'Roll 3d6, keep highest 2, add +1',
    },
  ];
}

/**
 * Check if a formula is an advanced dice expression
 * @param {string} formula - Formula to check
 * @returns {boolean} True if it's an advanced formula
 */
export function isValidFormula(formula) {
  if (!formula || typeof formula !== 'string') return false;

  const trimmed = formula.trim();

  // Check for basic dice pattern
  const basicMatch = trimmed.match(/^(\d*)d(\d+)/);
  if (!basicMatch) return false;

  const count = basicMatch[1] ? parseInt(basicMatch[1]) : 1;
  const sides = parseInt(basicMatch[2]);

  // Basic validation
  if (count <= 0 || count > 1000 || sides <= 0) return false;

  // Check for advanced features
  const remaining = trimmed.substring(basicMatch[0].length);

  // Keep highest/lowest - validate the keep count
  const keepMatch = remaining.match(/keep\s+(highest|lowest)\s+(\d+)/i);
  if (keepMatch) {
    const keepCount = parseInt(keepMatch[2]);
    if (keepCount <= 0 || keepCount > count) return false;
    return true;
  }

  // Exploding dice
  if (remaining.includes('!')) return true;

  // Count successes - validate the threshold
  const countMatch = remaining.match(/count\s+(\d+)\+/i);
  if (countMatch) {
    const threshold = parseInt(countMatch[1]);
    if (threshold <= 0 || threshold > sides) return false;
    return true;
  }

  // Advantage/disadvantage - validate dice count
  if (remaining.match(/(advantage|disadvantage)/i)) {
    if (count !== 2) return false;
    return true;
  }

  // If no advanced features, it's a basic formula
  return false;
}
