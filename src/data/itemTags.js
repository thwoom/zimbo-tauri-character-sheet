export const TAG_DEFINITIONS = {
  worn: 'Must be worn to function',
  armor: 'Provides armor points',
  messy: 'Attacks with this item are particularly gruesome',
  'two-handed': 'Requires both hands to use',
  precise: 'Use DEX instead of STR for damage',
  healing: 'Restores HP when used',
  consumable: 'Consumed on use',
  weightless: 'Does not count toward Load',
  magical: 'Has magical properties',
  '+1 damage': 'Adds +1 damage',
  '+1 forward': 'Take +1 on your next relevant roll',
  melee: 'Effective at close range',
  forceful: 'Can push your enemy back',
};

export function getTagDescription(tag) {
  return TAG_DEFINITIONS[tag] || '';
}
