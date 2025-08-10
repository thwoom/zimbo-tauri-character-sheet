export const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

const getSuccessContext = (description) => {
  if (description.includes('STR')) return "Power through with overwhelming force!";
  if (description.includes('DEX')) return "Graceful and precise execution!";
  if (description.includes('CON')) return "Tough as cybernetic nails!";
  if (description.includes('INT')) return "Brilliant tactical insight!";
  if (description.includes('WIS')) return "Crystal clear perception!";
  if (description.includes('CHA')) return "Surprisingly charming for a cyber-barbarian!";
  if (description.includes('Hack')) return "Clean hit, enemy can't counter!";
  if (description.includes('Taunt')) return "They're completely focused on you now!";
  return "Perfect execution!";
};

const getPartialContext = (description) => {
  if (description.includes('STR')) return "Success, but strain yourself or equipment";
  if (description.includes('DEX')) return "Stumble slightly, awkward position";
  if (description.includes('CON')) return "Feel the strain, maybe take harm";
  if (description.includes('INT')) return "Confusing situation, partial info";
  if (description.includes('WIS')) return "Something seems off, can't quite tell what";
  if (description.includes('CHA')) return "Awkward interaction, mixed signals";
  if (description.includes('Hack')) return "Hit them, but they hit you back!";
  if (description.includes('Taunt')) return "They attack you but with +1 ongoing damage!";
  return "Success with complications";
};

const getFailureContext = (description) => {
  if (description.includes('STR')) return "Too heavy, equipment fails, or overpower backfires";
  if (description.includes('DEX')) return "Trip, fumble, or end up in worse position";
  if (description.includes('CON')) return "Exhausted, hurt, or overcome by conditions";
  if (description.includes('INT')) return "No clue, wrong conclusion, or miss key detail";
  if (description.includes('WIS')) return "Completely missed the signs";
  if (description.includes('CHA')) return "Offensive, rude, or make things worse";
  if (description.includes('Hack')) return "Miss entirely, terrible position";
  if (description.includes('Taunt')) return "They ignore you completely";
  return "Things go badly";
};

export const rollDice = (formula, description = '', getStatusModifiers) => {
  let result = '';
  let total = 0;
  let interpretation = '';
  let context = '';

  if (formula.includes('2d6')) {
    const die1 = rollDie(6);
    const die2 = rollDie(6);
    const baseModifier = parseInt(formula.replace('2d6', '').replace('+', '') || '0');

    let rollType = 'general';
    if (description.includes('STR') || description.includes('Hack')) rollType = 'str';
    else if (description.includes('DEX')) rollType = 'dex';
    else if (description.includes('CON')) rollType = 'con';
    else if (description.includes('INT')) rollType = 'int';
    else if (description.includes('WIS')) rollType = 'wis';
    else if (description.includes('CHA')) rollType = 'cha';
    else if (description.includes('damage') || description.includes('Damage') || description.includes('Upper Hand') || description.includes('Bonus Damage')) rollType = 'damage';

    const statusMods = getStatusModifiers ? getStatusModifiers(rollType) : { modifier: 0, notes: [] };
    const totalModifier = baseModifier + statusMods.modifier;
    total = die1 + die2 + totalModifier;

    result = `2d6: [${die1}, ${die2}]`;
    if (baseModifier !== 0) result += ` ${baseModifier >= 0 ? '+' : ''}${baseModifier}`;
    if (statusMods.modifier !== 0) result += ` ${statusMods.modifier >= 0 ? '+' : ''}${statusMods.modifier}`;
    result += ` = ${total}`;
    if (statusMods.notes.length > 0) result += ` (${statusMods.notes.join(', ')})`;

    if (total >= 10) {
      interpretation = ' ✅ Success!';
      context = getSuccessContext(description);
    } else if (total >= 7) {
      interpretation = ' ⚠️ Partial Success';
      context = getPartialContext(description);
    } else {
      interpretation = ' ❌ Failure';
      context = getFailureContext(description);
    }
  } else if (formula.startsWith('d')) {
    const sides = parseInt(formula.replace('d', '').split('+')[0]);
    const baseModifier = parseInt(formula.split('+')[1] || '0');
    const roll = rollDie(sides);
    const rollType = description.includes('damage') || description.includes('Damage') ? 'damage' : 'general';
    const statusMods = getStatusModifiers ? getStatusModifiers(rollType) : { modifier: 0, notes: [] };
    const totalModifier = baseModifier + statusMods.modifier;
    total = roll + totalModifier;

    result = `d${sides}: ${roll}`;
    if (baseModifier !== 0) result += ` +${baseModifier}`;
    if (statusMods.modifier !== 0) result += ` ${statusMods.modifier >= 0 ? '+' : ''}${statusMods.modifier}`;
    result += ` = ${total}`;
    if (statusMods.notes.length > 0) result += ` (${statusMods.notes.join(', ')})`;
  }

  return {
    result: result + interpretation,
    description,
    context,
    total,
    timestamp: new Date().toLocaleTimeString(),
  };
};

