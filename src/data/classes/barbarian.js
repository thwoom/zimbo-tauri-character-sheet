export const barbarian = {
  name: 'Barbarian',
  description: 'A fierce warrior of primitive background.',

  template: {
    level: 1,
    hp: 25,
    maxHp: 25,
    xp: 0,
    xpNeeded: 8,
    levelUpPending: false,
    armor: 0,
    secondaryResource: 0,
    maxSecondaryResource: 0,

    stats: {
      STR: { score: 16, mod: 2 },
      DEX: { score: 13, mod: 1 },
      CON: { score: 15, mod: 1 },
      INT: { score: 8, mod: -1 },
      WIS: { score: 12, mod: 0 },
      CHA: { score: 9, mod: -1 },
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
        name: 'Greataxe',
        type: 'weapon',
        damage: 'd10',
        equipped: true,
        description: 'A massive two-handed axe',
        tags: ['melee', 'close', 'messy'],
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
      id: 'rage',
      name: 'Rage',
      description:
        'When you enter battle, roll+CON. On a 10+, hold 3. On a 7-9, hold 1. Spend your hold to:',
      choices: ['Deal +1d4 damage', 'Take +1 armor', 'Ignore one debility'],
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
