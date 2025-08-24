export const cleric = {
  name: 'Cleric',
  description: 'A divine agent of a greater power.',

  template: {
    level: 1,
    hp: 20,
    maxHp: 20,
    xp: 0,
    xpNeeded: 8,
    levelUpPending: false,
    armor: 1,
    secondaryResource: 3,
    maxSecondaryResource: 3, // Divine favor

    stats: {
      STR: { score: 13, mod: 1 },
      DEX: { score: 9, mod: -1 },
      CON: { score: 14, mod: 1 },
      INT: { score: 12, mod: 0 },
      WIS: { score: 16, mod: 2 },
      CHA: { score: 15, mod: 1 },
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
        name: 'Mace',
        type: 'weapon',
        damage: 'd8',
        equipped: true,
        description: 'A heavy mace, symbol of divine authority',
        tags: ['melee', 'close'],
        addedAt: new Date().toISOString(),
        notes: '',
      },
      {
        id: 2,
        name: 'Chainmail',
        type: 'armor',
        armor: 1,
        equipped: true,
        description: 'Heavy armor blessed by your deity',
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

    // Cleric-specific
    deity: {
      name: '',
      domain: '',
      precept: '',
    },
    prayerbook: {
      prepared: ['Cure Light Wounds', 'Sanctify'],
      known: ['Cure Light Wounds', 'Sanctify', 'Bless', 'Guidance', 'Light'],
      castToday: [],
    },
  },

  startingMoves: [
    {
      id: 'divine_guidance',
      name: 'Divine Guidance',
      description:
        'When you petition your deity according to your precept, you are granted some useful knowledge or boon. Your ask must be on a 10+ to have a chance of success.',
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
