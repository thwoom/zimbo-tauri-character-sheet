export const ranger = {
  name: 'Ranger',
  description: 'A wilderness warrior and tracker.',

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
      STR: { score: 12, mod: 0 },
      DEX: { score: 15, mod: 1 },
      CON: { score: 13, mod: 1 },
      INT: { score: 9, mod: -1 },
      WIS: { score: 16, mod: 2 },
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
        name: 'Bow',
        type: 'weapon',
        damage: 'd8',
        equipped: true,
        description: 'A well-crafted hunting bow',
        tags: ['ranged', 'near'],
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

    // Ranger-specific
    animalCompanion: {
      name: '',
      species: '',
      strengths: [],
      weaknesses: [],
      training: [],
    },
  },

  startingMoves: [
    {
      id: 'hunt_and_track',
      name: 'Hunt and Track',
      description:
        "When you follow a trail of clues left behind by passing creatures, roll+WIS. On a 10+, you follow the creature's trail until there's a significant change in its direction or mode of travel. On a 7-9, you follow the creature's trail but the GM will tell you what cost you incur in the process.",
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
  mechanics: {
    companionOptions: {
      species: ['Wolf', 'Hawk', 'Bear', 'Panther', 'Boar', 'Hound'],
      strengths: ['Ferocious', 'Swift', 'Keen Senses', 'Stealthy', 'Armored', 'Loyal'],
      weaknesses: ['Flighty', 'Slow', 'Fragile', 'Stubborn', 'Noisy'],
      training: ['Hunt', 'Guard', 'Scout', 'Perform', 'Track', 'Defend'],
    },
  },
};
