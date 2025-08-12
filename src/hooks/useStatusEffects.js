import { headerGradients } from '../styles/colorMap.js';

export default function useStatusEffects(character, setCharacter) {
  const statusEffects = character.statusEffects;
  const debilities = character.debilities;

  const statusEffectClassMap = {
    poisoned: 'poisoned-overlay',
    burning: 'burning-overlay',
    shocked: 'shocked-overlay',
    frozen: 'frozen-overlay',
    blessed: 'blessed-overlay',
  };

  const getActiveVisualEffects = () => {
    for (const [effect, cssClass] of Object.entries(statusEffectClassMap)) {
      if (statusEffects.includes(effect)) {
        return cssClass;
      }
    }
    return '';
  };

  const toggleStatusEffect = (effect) => {
    setCharacter((prev) => ({
      ...prev,
      statusEffects: prev.statusEffects.includes(effect)
        ? prev.statusEffects.filter((e) => e !== effect)
        : [...prev.statusEffects, effect],
    }));
  };

  const toggleDebility = (debility) => {
    setCharacter((prev) => ({
      ...prev,
      debilities: prev.debilities.includes(debility)
        ? prev.debilities.filter((d) => d !== debility)
        : [...prev.debilities, debility],
    }));
  };

  const getHeaderColor = () => {
    if (statusEffects.includes('poisoned')) return headerGradients.poisoned;
    if (statusEffects.includes('burning')) return headerGradients.burning;
    if (statusEffects.includes('shocked')) return headerGradients.shocked;
    if (statusEffects.includes('frozen')) return headerGradients.frozen;
    if (statusEffects.includes('blessed')) return headerGradients.blessed;
    return headerGradients.default;
  };

  return {
    statusEffects,
    debilities,
    getActiveVisualEffects,
    getHeaderColor,
    toggleStatusEffect,
    toggleDebility,
  };
}
