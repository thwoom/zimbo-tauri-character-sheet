export const rollDie = (sides) => {
  if (!Number.isInteger(sides) || sides <= 0) {
    throw new Error('sides must be a positive integer');
  }
  return Math.floor(Math.random() * sides) + 1;
};

export const rollDice = (formula) => {
  const match = formula.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) {
    throw new Error('Unsupported formula');
  }
  const count = parseInt(match[1] || '1', 10);
  const sides = parseInt(match[2], 10);
  const modifier = parseInt(match[3] || '0', 10);
  let total = 0;
  for (let i = 0; i < count; i += 1) {
    total += rollDie(sides);
  }
  return total + modifier;
};
