export const paladin = {
  name: 'Paladin',
  description: 'A holy warrior bound to a sacred oath.',

  template: {
    level: 1,
    hp: 22,
    maxHp: 22,
    xp: 0,
    xpNeeded: 8,
    levelUpPending: false,
    armor: 1,
    secondaryResource: 0,
    maxSecondaryResource: 0,

    stats: {
      STR: { score: 15, mod: 1 },
      DEX: { score: 9, mod: -1 },
      CON: { score: 13, mod: 1 },
      INT: { score: 12, mod: 0 },
      WIS: { score: 14, mod: 1 },
      CHA: { score: 16, mod: 2 },
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
        name: 'Sword',
        type: 'weapon',
        damage: 'd8',
        equipped: true,
        description: 'A blessed sword of justice',
        tags: ['melee', 'close'],
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

    // Paladin-specific
    oath: {
      tenets: [],
      quest: '',
    },
  },

  startingMoves: [
    {
      id: 'lay_on_hands',
      name: 'Lay on Hands',
      description:
        'When you touch someone, skin to skin, and pray for their well-being, roll+CHA. On a 10+, you restore 1d8 damage or one debility. On a 7-9, you restore 1 damage or the target is stabilized.',
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
