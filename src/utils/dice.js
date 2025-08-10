export function parseDiceNotation(formula, rollDie) {
  const match = formula.trim().match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (!match) {
    return { error: `Cannot parse dice formula: ${formula}` };
  }
  const count = parseInt(match[1] || '1', 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  if (count <= 0 || sides <= 0) {
    return { error: `Invalid dice formula: ${formula}` };
  }
  const rolls = Array.from({ length: count }, () => rollDie(sides));
  const total = rolls.reduce((sum, val) => sum + val, 0) + modifier;
  return { rolls, sides, modifier, total };
}
