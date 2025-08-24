export const bard = {
  name: 'Bard',
  description: 'A charismatic performer who uses music and magic.',

  template: {
    level: 1,
    hp: 16,
    maxHp: 16,
    xp: 0,
    xpNeeded: 8,
    levelUpPending: false,
    armor: 0,
    secondaryResource: 0,
    maxSecondaryResource: 0,

    stats: {
      STR: { score: 8, mod: -1 },
      DEX: { score: 14, mod: 1 },
      CON: { score: 12, mod: 0 },
      INT: { score: 13, mod: 1 },
      WIS: { score: 9, mod: -1 },
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
        name: 'Lute',
        type: 'weapon',
        damage: 'd4',
        equipped: true,
        description: 'A finely crafted musical instrument',
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
  },

  startingMoves: [
    {
      id: 'arcane_art',
      name: 'Arcane Art',
      description:
        'When you weave a performance into a basic spell, roll+CHA. On a 10+, the spell is cast with no problems. On a 7-9, the spell is cast, but choose one:',
      choices: [
        'You draw unwelcome attention',
        'The spell disturbs your allies',
        'The spell is forgotten',
      ],
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
