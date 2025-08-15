import { headerGradients } from '../styles/colorMap.js';

export const statusEffectImageMap = {
  default: '/avatars/default.svg',
  poisoned: '/avatars/poisoned.svg',
};

export const getStatusEffectImage = (statusEffects = []) => {
  const effect = statusEffects.find((e) => statusEffectImageMap[e]);
  return statusEffectImageMap[effect] || statusEffectImageMap.default;
};

export default function useStatusEffects(character, setCharacter) {
  const statusEffects = character.statusEffects;
  const debilities = character.debilities;

  const statusEffectClassMap = {
    poisoned: 'poisoned-overlay',
    burning: 'burning-overlay',
    shocked: 'shocked-overlay',
    frozen: 'frozen-overlay',
    blessed: 'blessed-overlay',
    confused: 'confused-overlay',
    weakened: 'weakened-overlay',
    invisible: 'invisible-overlay',
  };

  const getActiveVisualEffects = () => {
    return Object.entries(statusEffectClassMap)
      .filter(([effect]) => statusEffects.includes(effect))
      .map(([, cssClass]) => cssClass)
      .join(' ');
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
    getStatusEffectImage: () => getStatusEffectImage(statusEffects),
    getHeaderColor,
    toggleStatusEffect,
    toggleDebility,
  };
}
