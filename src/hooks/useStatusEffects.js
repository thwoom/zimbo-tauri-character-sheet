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
    if (statusEffects.includes('poisoned'))
      return 'linear-gradient(45deg, #22c55e, #059669, #00d4aa)';
    if (statusEffects.includes('burning'))
      return 'linear-gradient(45deg, #ef4444, #f97316, #fbbf24)';
    if (statusEffects.includes('shocked'))
      return 'linear-gradient(45deg, #3b82f6, #eab308, #00d4aa)';
    if (statusEffects.includes('frozen'))
      return 'linear-gradient(45deg, #06b6d4, #3b82f6, #6366f1)';
    if (statusEffects.includes('blessed'))
      return 'linear-gradient(45deg, #fbbf24, #f59e0b, #00d4aa)';
    return 'linear-gradient(45deg, #6366f1, #8b5cf6, #00d4aa)';
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
