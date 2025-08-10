export const rollDie = (sides) => {
  if (!Number.isInteger(sides) || sides <= 0) {
    throw new Error('sides must be a positive integer');
  }
  if (typeof crypto?.randomInt === 'function') {
    return crypto.randomInt(1, sides + 1);
  }
  if (typeof crypto?.getRandomValues === 'function') {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % sides) + 1;
  }
  throw new Error('Secure random number generation is not supported');
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
