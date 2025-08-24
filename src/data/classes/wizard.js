export const wizard = {
  name: 'Wizard',
  description: 'A scholarly magic-user capable of manipulating the structures of reality.',

  // Starting character template
  template: {
    level: 1,
    hp: 16,
    maxHp: 16,
    xp: 0,
    xpNeeded: 8,
    levelUpPending: false,
    armor: 0,
    secondaryResource: 3,
    maxSecondaryResource: 3, // Spell slots

    stats: {
      STR: { score: 9, mod: -1 },
      DEX: { score: 12, mod: 0 },
      CON: { score: 13, mod: 1 },
      INT: { score: 16, mod: 2 },
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
        name: 'Staff',
        type: 'weapon',
        damage: 'd6',
        equipped: true,
        description: 'A wooden staff, useful for casting and self-defense',
        tags: ['melee', 'close'],
        addedAt: new Date().toISOString(),
        notes: '',
      },
      {
        id: 2,
        name: 'Spellbook',
        type: 'magic',
        equipped: false,
        description: 'Your collection of arcane knowledge and spells',
        addedAt: new Date().toISOString(),
        notes: '',
      },
      {
        id: 3,
        name: 'Adventuring Gear',
        type: 'gear',
        quantity: 5,
        description: 'Rope, torches, chalk, and other essentials',
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

    // Wizard-specific data
    spellbook: {
      prepared: ['Magic Missile', 'Charm Person', 'Detect Magic'],
      known: ['Magic Missile', 'Charm Person', 'Detect Magic', 'Invisibility', 'Fireball'],
      castToday: [],
    },
  },

  // Starting moves (always available)
  startingMoves: [
    {
      id: 'cast_a_spell',
      name: 'Cast a Spell',
      description:
        "When you release a spell you've prepared, roll+INT. On a 10+, the spell is successfully cast and you do not forget the spell. On a 7-9, the spell is cast, but choose one:",
      choices: [
        'You draw unwelcome attention or put yourself in a spot. The GM will tell you how.',
        'The spell disturbs the fabric of reality as it is cast—take -1 ongoing to cast a spell until the next time you Prepare Spells.',
        'After it is cast, the spell is forgotten. You cannot cast it again until you prepare spells.',
      ],
      type: 'starting',
    },
    {
      id: 'prepare_spells',
      name: 'Prepare Spells',
      description:
        'When you spend uninterrupted time (an hour or so) in quiet contemplation of your spellbook, you:',
      choices: [
        'Lose any spells you already have prepared',
        "Prepare new spells of your choice from your spellbook whose total levels don't exceed your own level+1",
        'Prepare your cantrips which never count against your limit',
      ],
      type: 'starting',
    },
    {
      id: 'ritual',
      name: 'Ritual',
      description:
        'When you draw on a place of power to create a magical effect, tell the GM what you want to achieve. Ritual effects are always possible, but the GM will give you one to four of the following conditions:',
      choices: [
        "It's going to take hours/days/weeks",
        'First you must ____',
        "You'll need help from ____",
        'It will require a lot of money',
        'The best you can do is a lesser version, unreliable and limited',
        'You and your allies will risk danger from ____',
        "You'll have to disenchant ____ to do it",
      ],
      type: 'starting',
    },
    {
      id: 'empowered_magic',
      name: 'Empowered Magic',
      description:
        'When you cast a spell, on a 10+ you have the option of choosing from the 7-9 list. If you do, you may choose one of these effects as well:',
      choices: [
        "The spell's effects are maximized",
        "The spell's targets are doubled",
        "The spell's duration is doubled",
      ],
      type: 'starting',
    },
    {
      id: 'familiar',
      name: 'Familiar',
      description:
        'You have a magical animal companion. Describe it. When you cast a spell, your familiar can deliver it. If your familiar is ever harmed or threatened, you take -1 ongoing until the issue is resolved.',
      type: 'starting',
    },
  ],

  // Advanced moves (selected through leveling)
  advancedMoves: [
    {
      id: 'protege',
      name: 'Protege',
      description:
        'When you take on an apprentice, you mark XP when they make a mistake that you could have prevented.',
      level: 2,
      type: 'advanced',
    },
    {
      id: 'spell_defender',
      name: 'Spell Defender',
      description: 'When you cast a spell, you take +1 armor forward.',
      level: 2,
      type: 'advanced',
    },
    {
      id: 'counterspell',
      name: 'Counterspell',
      description:
        'When you see another creature cast a spell, you may immediately cast the same spell as if it was on your list (expending a spell slot as normal).',
      level: 3,
      type: 'advanced',
    },
    {
      id: 'empower',
      name: 'Empower',
      description:
        'When you cast a spell, you can choose to take -1 ongoing to cast a spell to add +1 to the roll.',
      level: 3,
      type: 'advanced',
    },
    {
      id: 'multiclass_dabbler',
      name: 'Multiclass Dabbler',
      description:
        'Get one move from another class. Treat your level as one lower for choosing the move.',
      level: 4,
      type: 'advanced',
    },
    {
      id: 'spell_binder',
      name: 'Spell Binder',
      description:
        'When you successfully cast a spell, you can choose to bind it to a nearby object or creature. The spell remains dormant until triggered by a condition you set.',
      level: 4,
      type: 'advanced',
    },
    {
      id: 'arcane_art',
      name: 'Arcane Art',
      description:
        'When you cast a spell, you can choose to make it permanent. If you do, you take -1 ongoing to cast a spell until you take a long rest.',
      level: 5,
      type: 'advanced',
    },
    {
      id: 'world_walker',
      name: 'World Walker',
      description:
        "When you cast a spell, you can choose to open a portal to another place you've been. The portal lasts for a moment and you can step through.",
      level: 5,
      type: 'advanced',
    },
    {
      id: 'unlimited_power',
      name: 'Unlimited Power',
      description:
        'When you cast a spell, you can choose to cast it without expending a spell slot. If you do, you take -1 ongoing to cast a spell until you take a long rest.',
      level: 6,
      type: 'advanced',
    },
  ],

  // Class-specific mechanics
  mechanics: {
    // Spell levels and slots
    spellSlots: {
      1: 3, // Level 1: 3 spell slots
      2: 4, // Level 2: 4 spell slots
      3: 5, // Level 3: 5 spell slots
      4: 6, // Level 4: 6 spell slots
      5: 7, // Level 5: 7 spell slots
      6: 8, // Level 6: 8 spell slots
    },

    // Cantrips (always available)
    cantrips: ['Light', 'Unseen Servant', 'Prestidigitation', 'Mage Hand', 'Message'],

    // Starting spells
    startingSpells: ['Magic Missile', 'Charm Person', 'Detect Magic', 'Invisibility', 'Fireball'],
  },
};
