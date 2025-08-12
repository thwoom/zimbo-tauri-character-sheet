import { useState, useEffect } from 'react';
import { debilityTypes } from '../state/character';
import * as diceUtils from '../utils/dice.js';
import safeLocalStorage from '../utils/safeLocalStorage.js';
import useModal from './useModal';

export default function useDiceRoller(character, setCharacter, autoXpOnMiss) {
  const [rollResult, setRollResult] = useState('Ready to roll!');
  const [rollModalData, setRollModalData] = useState({});
  const [rollHistory, setRollHistory] = useState(() => {
    const saved = safeLocalStorage.getItem('rollHistory');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing roll history from localStorage', error);
      return [];
    }
  });
  const rollModal = useModal();

  useEffect(() => {
    if (rollHistory.length > 0) {
      safeLocalStorage.setItem('rollHistory', JSON.stringify(rollHistory));
    } else {
      safeLocalStorage.removeItem('rollHistory');
    }
  }, [rollHistory]);

  const getStatusModifiers = (rollType = 'general') => {
    let modifier = 0;
    const notes = [];

    if (character.statusEffects.includes('poisoned')) {
      modifier -= 1;
      notes.push('Poisoned (-1)');
    }
    if (character.statusEffects.includes('shocked') && rollType === 'dex') {
      modifier -= 2;
      notes.push('Shocked (-2 DEX)');
    }
    if (character.statusEffects.includes('weakened') && rollType === 'damage') {
      modifier -= 1;
      notes.push('Weakened (-1 damage)');
    }
    if (character.statusEffects.includes('frozen') && (rollType === 'str' || rollType === 'dex')) {
      modifier -= 1;
      notes.push('Frozen (-1 physical)');
    }
    if (character.statusEffects.includes('blessed')) {
      modifier += 1;
      notes.push('Blessed (+1)');
    }

    character.debilities.forEach((debility) => {
      if (
        (debility === 'weak' && rollType === 'str') ||
        (debility === 'shaky' && rollType === 'dex') ||
        (debility === 'sick' && rollType === 'con') ||
        (debility === 'stunned' && rollType === 'int') ||
        (debility === 'confused' && rollType === 'wis') ||
        (debility === 'scarred' && rollType === 'cha')
      ) {
        modifier -= 1;
        notes.push(`${debilityTypes[debility].name} (-1)`);
      }
    });

    return { modifier, notes };
  };

  const getSuccessContext = (description) => {
    description = description.toLowerCase();
    if (description.includes('str')) return 'Power through with overwhelming force!';
    if (description.includes('dex')) return 'Graceful and precise execution!';
    if (description.includes('con')) return 'Tough as cybernetic nails!';
    if (description.includes('int')) return 'Brilliant tactical insight!';
    if (description.includes('wis')) return 'Crystal clear perception!';
    if (description.includes('cha')) return 'Surprisingly charming for a cyber-barbarian!';
    if (description.includes('hack')) return "Clean hit, enemy can't counter!";
    if (description.includes('taunt')) return "They're completely focused on you now!";
    if (description.includes('upper hand')) return 'Extra brutal damage with the upper hand!';
    return 'Perfect execution!';
  };

  const getPartialContext = (description) => {
    description = description.toLowerCase();
    if (description.includes('str')) return 'Success, but strain yourself or equipment';
    if (description.includes('dex')) return 'Stumble slightly, awkward position';
    if (description.includes('con')) return 'Feel the strain, maybe take harm';
    if (description.includes('int')) return 'Confusing situation, partial info';
    if (description.includes('wis')) return "Something seems off, can't quite tell what";
    if (description.includes('cha')) return 'Awkward interaction, mixed signals';
    if (description.includes('hack')) return 'Hit them, but they hit you back!';
    if (description.includes('taunt')) return 'They attack you but with +1 ongoing damage!';
    if (description.includes('upper hand')) return 'Deal damage, but lose the upper hand!';
    return 'Success with complications';
  };

  const getFailureContext = (description) => {
    description = description.toLowerCase();
    if (description.includes('str')) return 'Too heavy, equipment fails, or overpower backfires';
    if (description.includes('dex')) return 'Trip, fumble, or end up in worse position';
    if (description.includes('con')) return 'Exhausted, hurt, or overcome by conditions';
    if (description.includes('int')) return 'No clue, wrong conclusion, or miss key detail';
    if (description.includes('wis')) return 'Completely missed the signs';
    if (description.includes('cha')) return 'Offensive, rude, or make things worse';
    if (description.includes('hack')) return 'Miss entirely, terrible position';
    if (description.includes('taunt')) return 'They ignore you completely';
    if (description.includes('upper hand')) return 'Upper hand slips away completely!';
    return 'Things go badly';
  };

  const rollDice = (formula, description = '') => {
    const desc = description.toLowerCase();
    let result = '';
    let total = 0;
    let interpretation = '';
    let context = '';

    const match = formula.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (!match) return;

    const diceCount = parseInt(match[1] || '1', 10);
    const sides = parseInt(match[2], 10);
    const baseModifier = parseInt(match[3] || '0', 10);
    const dicePart = `${diceCount !== 1 ? diceCount : ''}d${sides}`;

    let rollType = 'general';
    if (desc.includes('str') || desc.includes('hack')) rollType = 'str';
    else if (desc.includes('dex')) rollType = 'dex';
    else if (desc.includes('con')) rollType = 'con';
    else if (desc.includes('int')) rollType = 'int';
    else if (desc.includes('wis')) rollType = 'wis';
    else if (desc.includes('cha')) rollType = 'cha';
    else if (
      desc.includes('damage') ||
      desc.includes('upper hand') ||
      desc.includes('bonus damage')
    )
      rollType = 'damage';

    const statusMods = getStatusModifiers(rollType);
    const totalModifier = baseModifier + statusMods.modifier;

    const rolls = [];
    for (let i = 0; i < diceCount; i += 1) {
      rolls.push(diceUtils.rollDie(sides));
    }
    let roll = rolls.reduce((sum, r) => sum + r, 0);
    total = roll + totalModifier;

    result = `${dicePart}: ${rolls.join(' + ')}`;
    if (baseModifier !== 0) {
      result += ` ${baseModifier >= 0 ? '+' : ''}${baseModifier}`;
    }
    if (statusMods.modifier !== 0) {
      result += ` ${statusMods.modifier >= 0 ? '+' : ''}${statusMods.modifier}`;
    }
    result += ` = ${total}`;

    if (statusMods.notes.length > 0) {
      result += ` (${statusMods.notes.join(', ')})`;
    }

    let originalResult;
    if (dicePart === '2d6') {
      if (total >= 10) {
        interpretation = ' ✅ Success!';
        context = getSuccessContext(desc);
      } else if (total >= 7) {
        interpretation = ' ⚠️ Partial Success';
        context = getPartialContext(desc);
      } else {
        interpretation = ' ❌ Failure';
        context = getFailureContext(desc);
        if (autoXpOnMiss) {
          setCharacter((prev) => ({ ...prev, xp: prev.xp + 1 }));
        }
        if (window.confirm('Did you get help?')) {
          originalResult = result + interpretation;
          let bond = parseInt(window.prompt('Bond bonus? (0-3)', '0'), 10);
          if (Number.isNaN(bond)) bond = 0;
          bond = Math.max(0, Math.min(3, bond));
          const newRolls = [diceUtils.rollDie(6), diceUtils.rollDie(6)];
          rolls.splice(0, rolls.length, ...newRolls);
          roll = newRolls[0] + newRolls[1];
          total = roll + totalModifier + bond;
          result = `2d6: ${rolls.join(' + ')}`;
          if (baseModifier !== 0) {
            result += ` ${baseModifier >= 0 ? '+' : ''}${baseModifier}`;
          }
          if (statusMods.modifier !== 0) {
            result += ` ${statusMods.modifier >= 0 ? '+' : ''}${statusMods.modifier}`;
          }
          if (bond !== 0) {
            result += ` +${bond}`;
          }
          result += ` = ${total}`;
          if (statusMods.notes.length > 0) {
            result += ` (${statusMods.notes.join(', ')})`;
          }
          if (total >= 10) {
            interpretation = ' ✅ Success!';
            context = getSuccessContext(desc);
          } else if (total >= 7) {
            interpretation = ' ⚠️ Partial Success';
            context = getPartialContext(desc);
          } else {
            interpretation = ' ❌ Failure';
            context = getFailureContext(desc);
            if (autoXpOnMiss) {
              setCharacter((prev) => ({ ...prev, xp: prev.xp + 1 }));
            }
          }
        }
      }
    }

    const rollData = {
      result: result + interpretation,
      description,
      context,
      total,
      rolls,
      modifier: totalModifier,
      timestamp: new Date().toLocaleTimeString(),
      ...(originalResult && { originalResult }),
    };
    if (originalResult) rollData.originalResult = originalResult;

    setRollHistory((prev) => [rollData, ...prev.slice(0, 9)]);
    setRollModalData(rollData);
    setRollResult(rollData.result);
    rollModal.open();
  };

  return {
    rollResult,
    setRollResult,
    rollHistory,
    rollDice,
    rollModal,
    rollModalData,
    rollDie: diceUtils.rollDie,
    clearRollHistory: () => setRollHistory([]),
  };
}
