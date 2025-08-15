import { headerGradients } from '../styles/colorMap.js';

export const statusEffectImageMap = {
  default: '/avatars/default.svg',
  poisoned: '/avatars/poisoned.svg',
  burning: '/avatars/default.svg',
  shocked: '/avatars/default.svg',
  frozen: '/avatars/default.svg',
  blessed: '/avatars/default.svg',
  lowHp: '/avatars/default.svg',
  stunned: '/avatars/default.svg',
  shielded: '/avatars/default.svg',
};

export const getStatusEffectImage = (statusEffects = []) => {
  if (statusEffects.includes('poisoned')) return statusEffectImageMap.poisoned;
  if (statusEffects.includes('burning')) return statusEffectImageMap.burning;
  if (statusEffects.includes('shocked')) return statusEffectImageMap.shocked;
  if (statusEffects.includes('frozen')) return statusEffectImageMap.frozen;
  if (statusEffects.includes('blessed')) return statusEffectImageMap.blessed;
  if (statusEffects.includes('lowHp')) return statusEffectImageMap.lowHp;
  if (statusEffects.includes('stunned')) return statusEffectImageMap.stunned;
  if (statusEffects.includes('shielded')) return statusEffectImageMap.shielded;
  return statusEffectImageMap.default;
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

  const getStatusEffectImageLocal = () => {
    const effect = statusEffects.find((e) => statusEffectImageMap[e]);
    return statusEffectImageMap[effect] || statusEffectImageMap.default;
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
    getStatusEffectImage: getStatusEffectImageLocal,
    getHeaderColor,
    toggleStatusEffect,
    toggleDebility,
  };
}
