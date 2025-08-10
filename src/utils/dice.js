const MAX_COUNT = 1000;

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
  const match = formula.match(/^\s*(\d*)\s*[dD]\s*(\d+)\s*([+-]\s*\d+)?\s*$/);
  if (!match) {
    throw new Error('Unsupported formula');
  }
  const count = parseInt(match[1] || '1', 10);
  if (count > MAX_COUNT) {
    throw new Error(`count must not exceed ${MAX_COUNT}`);
  }
  const sides = parseInt(match[2], 10);
  const modifier = parseInt((match[3] || '0').replace(/\s+/g, ''), 10);
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('count must be a positive integer');
  }
  if (!Number.isInteger(sides) || sides <= 0) {
    throw new Error('sides must be a positive integer');
  }
  let total = 0;
  for (let i = 0; i < count; i += 1) {
    total += rollDie(sides);
  }
  return total + modifier;
};
