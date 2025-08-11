import { useState, useEffect } from 'react';
import { debilityTypes } from '../state/character';
import { rollDie, rollDice as rollDiceUtil } from '../utils/dice.js';
import useModal from './useModal';

export default function useDiceRoller(character, setCharacter, autoXpOnMiss) {
  const [rollResult, setRollResult] = useState('Ready to roll!');
  const [rollModalData, setRollModalData] = useState({});
  const [rollHistory, setRollHistory] = useState(() => {
    const saved = localStorage.getItem('rollHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const rollModal = useModal();

  useEffect(() => {
    if (rollHistory.length > 0) {
      localStorage.setItem('rollHistory', JSON.stringify(rollHistory));
    } else {
      localStorage.removeItem('rollHistory');
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
    return 'Things go badly';
  };

  const rollDice = (formula, description = '') => {
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
      else if (
        description.includes('damage') ||
        description.includes('Damage') ||
        description.includes('Upper Hand') ||
        description.includes('Bonus Damage')
      )
        rollType = 'damage';

      const statusMods = getStatusModifiers(rollType);
      const totalModifier = baseModifier + statusMods.modifier;
      total = die1 + die2 + totalModifier;

      result = `2d6: [${die1}, ${die2}]`;
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

      if (total >= 10) {
        interpretation = ' ✅ Success!';
        context = getSuccessContext(description);
      } else if (total >= 7) {
        interpretation = ' ⚠️ Partial Success';
        context = getPartialContext(description);
      } else {
        interpretation = ' ❌ Failure';
        context = getFailureContext(description);
        if (autoXpOnMiss) {
          setCharacter((prev) => ({ ...prev, xp: prev.xp + 1 }));
        }
      }
    } else if (formula.startsWith('d')) {
      const sides = parseInt(formula.replace('d', '').split('+')[0]);
      const baseModifier = parseInt(formula.split('+')[1] || '0');
      const roll = rollDiceUtil(`1d${sides}`);

      const rollType =
        description.includes('damage') || description.includes('Damage') ? 'damage' : 'general';
      const statusMods = getStatusModifiers(rollType);
      const totalModifier = baseModifier + statusMods.modifier;
      total = roll + totalModifier;

      result = `d${sides}: ${roll}`;
      if (baseModifier !== 0) {
        result += ` +${baseModifier}`;
      }
      if (statusMods.modifier !== 0) {
        result += ` ${statusMods.modifier >= 0 ? '+' : ''}${statusMods.modifier}`;
      }
      result += ` = ${total}`;

      if (statusMods.notes.length > 0) {
        result += ` (${statusMods.notes.join(', ')})`;
      }
    }

    const rollData = {
      result: result + interpretation,
      description,
      context,
      total,
      timestamp: new Date().toLocaleTimeString(),
    };

    setRollHistory((prev) => [rollData, ...prev.slice(0, 9)]);
    setRollModalData(rollData);
    rollModal.open();
  };

  return {
    rollResult,
    setRollResult,
    rollHistory,
    rollDice,
    rollModal,
    rollModalData,
    rollDie,
    clearRollHistory: () => setRollHistory([]),
  };
}
