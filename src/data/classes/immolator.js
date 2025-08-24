export const immolator = {
  name: 'Immolator',
  description: 'A fire-wielding warrior who channels destructive flames.',

  template: {
    level: 1,
    hp: 18,
    maxHp: 18,
    xp: 0,
    xpNeeded: 8,
    levelUpPending: false,
    armor: 0,
    secondaryResource: 0,
    maxSecondaryResource: 0,

    stats: {
      STR: { score: 13, mod: 1 },
      DEX: { score: 14, mod: 1 },
      CON: { score: 12, mod: 0 },
      INT: { score: 10, mod: 0 },
      WIS: { score: 15, mod: 1 },
      CHA: { score: 8, mod: -1 },
    },

    resources: {
      chronoUses: 0,
      paradoxPoints: 0,
      bandages: 3,
      rations: 5,
      advGear: 5,
    },

    bonds: [
      { name: '', relationship: '', resolved: false },
      { name: '', relationship: '', resolved: false },
      { name: '', relationship: '', resolved: false },
    ],

    statusEffects: [],
    debilities: [],

    inventory: [
      {
        id: 1,
        name: 'Flame Blade',
        type: 'weapon',
        damage: 'd8',
        equipped: true,
        description: 'A blade wreathed in magical flames',
        tags: ['melee', 'close', 'fire'],
        addedAt: new Date().toISOString(),
        notes: '',
      },
    ],

    selectedMoves: [],
    actionHistory: [],
    sessionNotes: '',
    sessionRecapPublic: '',
    rollHistory: [],
    lastSessionEnd: null,
    sessionRecap: '',
  },

  startingMoves: [
    {
      id: 'burn',
      name: 'Burn',
      description:
        'When you call upon the power of flame, roll+WIS. On a 10+, hold 3. On a 7-9, hold 1. Spend your hold to:',
      choices: ['Deal 1d6 damage to an enemy', 'Create a wall of flame', 'Light something on fire'],
      type: 'starting',
    },
  ],

  advancedMoves: [
    {
      id: 'multiclass_dabbler',
      name: 'Multiclass Dabbler',
      description:
        'Get one move from another class. Treat your level as one lower for choosing the move.',
      level: 2,
      type: 'advanced',
    },
  ],

  mechanics: {},
};
