export const INITIAL_CHARACTER_DATA = {
  // Basic Info
  level: 4,
  hp: 15,
  maxHp: 25,
  xp: 4,
  xpNeeded: 12, // Formula: (level + 1) * 7
  armor: 0,

  // Attributes
  stats: {
    STR: { score: 18, mod: 3 }, // mod = Math.floor((score - 10) / 2)
    DEX: { score: 15, mod: 1 },
    CON: { score: 16, mod: 2 },
    INT: { score: 9, mod: 0 },
    WIS: { score: 13, mod: 1 },
    CHA: { score: 8, mod: -1 },
  },

  // Resources & Abilities
  resources: {
    chronoUses: 2, // Ring of Smooshed Chronologies
    paradoxPoints: 0, // 0-3, 3 = reality unstable
    bandages: 3, // Heal 4 HP slowly
    rations: 5, // Satisfy hunger at camp
    advGear: 5, // Rope, torches, chalk, etc.
  },

  // Character Relationships
  bonds: [
    { name: 'Sar', relationship: 'I will teach Sar about the future', resolved: false },
    { name: 'Kael', relationship: 'Kael reminds me of someone I lost', resolved: false },
  ],

  // Status Conditions
  statusEffects: [], // Keys: poisoned, shocked, burning, frozen, confused, weakened, blessed, invisible
  debilities: [], // Keys: weak, shaky, sick, stunned, confused, scarred

  // Equipment & Items
  inventory: [
    {
      id: 1,
      name: 'Entropic Cyber-Warhammer',
      type: 'weapon',
      damage: 'd10+3',
      equipped: true,
      description: 'Phases through time occasionally',
      tags: ['melee', 'forceful', 'messy'],
    },
    {
      id: 2,
      name: 'Ring of Smooshed Chronologies',
      type: 'magic',
      equipped: true,
      description: 'Grants Chrono-Retcon ability',
    },
    {
      id: 3,
      name: 'Gravity Beetle Shell',
      type: 'material',
      quantity: 1,
      description: "Crafting material for Sar's companion Kumquat",
    },
    {
      id: 4,
      name: 'Healing Potion',
      type: 'consumable',
      quantity: 2,
      description: 'Restore 1d8 HP',
    },
    {
      id: 5,
      name: 'Cyber-Plated Vest',
      type: 'armor',
      armor: 1,
      equipped: false,
      description: 'Light armor with energy dispersal',
    },
  ],

  // Character Progression
  selectedMoves: [], // Advanced moves acquired through leveling
  actionHistory: [], // For undo functionality (last 5 actions)

  // Session Data
  sessionNotes: '', // Campaign notes and events
  rollHistory: [], // Recent dice rolls (last 10)
};

export const statusEffectTypes = {
  poisoned: { name: 'Poisoned', description: '-1 to all rolls', color: 'green', icon: '🤢' },
  shocked: { name: 'Shocked', description: '-2 to DEX rolls', color: 'blue-yellow', icon: '⚡' },
  burning: {
    name: 'Burning',
    description: 'Fire damage each turn',
    color: 'red-orange',
    icon: '🔥',
  },
  frozen: { name: 'Frozen', description: '-1 to physical actions', color: 'cyan-blue', icon: '🧊' },
  confused: {
    name: 'Confused',
    description: 'GM controls one action',
    color: 'purple',
    icon: '😵',
  },
  weakened: { name: 'Weakened', description: '-1 to damage rolls', color: 'gray', icon: '💔' },
  blessed: { name: 'Blessed', description: '+1 to all rolls', color: 'yellow', icon: '✨' },
  invisible: {
    name: 'Invisible',
    description: 'Cannot be targeted',
    color: 'transparent',
    icon: '👻',
  },
};

export const debilityTypes = {
  weak: { name: 'Weak', description: '-1 to STR rolls', icon: '💪' },
  shaky: { name: 'Shaky', description: '-1 to DEX rolls', icon: '🫨' },
  sick: { name: 'Sick', description: '-1 to CON rolls', icon: '🤒' },
  stunned: { name: 'Stunned', description: '-1 to INT rolls', icon: '😵‍💫' },
  confused: { name: 'Confused', description: '-1 to WIS rolls', icon: '🤯' },
  scarred: { name: 'Scarred', description: '-1 to CHA rolls', icon: '😰' },
};
