export const druid = {
  name: 'Druid',
  description: 'A guardian of the natural world with the power to shapeshift.',

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
      STR: { score: 10, mod: 0 },
      DEX: { score: 13, mod: 1 },
      CON: { score: 14, mod: 1 },
      INT: { score: 12, mod: 0 },
      WIS: { score: 16, mod: 2 },
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
        name: 'Staff',
        type: 'weapon',
        damage: 'd6',
        equipped: true,
        description: 'A wooden staff carved with natural symbols',
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
      id: 'shapeshifter',
      name: 'Shapeshifter',
      description:
        'When you call upon the spirits of nature to change your shape, roll+WIS. On a 10+, hold 3. On a 7-9, hold 1. On a miss, the GM will hold 1 and spend it to cause you a problem. Spend your hold to:',
      choices: [
        "Transform into a creature whose form you've studied",
        'Add +1 to your roll to act in the new form',
        'Take +1 armor while in the new form',
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
