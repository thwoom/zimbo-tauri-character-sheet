export const rollDie = (sides) => {
  if (!Number.isInteger(sides) || sides <= 0) {
    throw new Error('sides must be a positive integer');
  }
  return Math.floor(Math.random() * sides) + 1;
};

export const rollDice = (formula) => {
  if (formula.includes('2d6')) {
    const modifier = parseInt(formula.replace('2d6', '').replace('+', ''), 10) || 0;
    const die1 = rollDie(6);
    const die2 = rollDie(6);
    return die1 + die2 + modifier;
  }
  if (formula.startsWith('d')) {
    const [sidesPart, modPart] = formula.split('+');
    const sides = parseInt(sidesPart.slice(1), 10);
    const modifier = parseInt(modPart || '0', 10);
    const roll = rollDie(sides);
    return roll + modifier;
  }
  throw new Error('Unsupported formula');
};
