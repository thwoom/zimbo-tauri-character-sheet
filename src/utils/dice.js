const MAX_COUNT = 1000;

export const rollDie = (sides) => {
  if (!Number.isInteger(sides) || sides <= 0) {
    throw new Error('sides must be a positive integer');
  }
  return Math.floor(Math.random() * sides) + 1;
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
