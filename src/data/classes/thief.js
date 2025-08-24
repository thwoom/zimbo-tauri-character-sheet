export const thief = {
  name: 'Thief',
  description: 'A scoundrel who uses stealth, trickery, and mobility to overcome obstacles.',

  // Starting character template
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
      DEX: { score: 16, mod: 2 },
      CON: { score: 13, mod: 1 },
      INT: { score: 14, mod: 1 },
      WIS: { score: 9, mod: -1 },
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
        name: 'Daggers',
        type: 'weapon',
        damage: 'd6',
        equipped: true,
        description: 'A pair of sharp, concealable daggers',
        tags: ['melee', 'close', 'thrown'],
        addedAt: new Date().toISOString(),
        notes: '',
      },
      {
        id: 2,
        name: 'Leather Armor',
        type: 'armor',
        armor: 1,
        equipped: true,
        description: "Light, flexible armor that doesn't impede movement",
        addedAt: new Date().toISOString(),
        notes: '',
      },
      {
        id: 3,
        name: "Thieves' Tools",
        type: 'gear',
        quantity: 1,
        description: 'Lockpicks, wire, and other tools of the trade',
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

  // Starting moves (always available)
  startingMoves: [
    {
      id: 'backstab',
      name: 'Backstab',
      description:
        'When you attack a surprised or defenseless enemy with a melee weapon, you can choose to deal your damage or roll+DEX. On a 10+ choose two. On a 7-9 choose one:',
      choices: [
        "You don't get into melee with them",
        'You gain something useful from them',
        "You don't take any damage from them",
        'You create an opportunity for an ally',
      ],
      type: 'starting',
    },
    {
      id: 'trap_expert',
      name: 'Trap Expert',
      description:
        'When you spend a moment to survey a dangerous area, roll+DEX. On a 10+, hold 3. On a 7-9, hold 1. Spend your hold as you walk through the area to ask questions about what you find:',
      choices: [
        'Is there a trap here and if so, what activates it?',
        'What does the trap do when activated?',
        'What here is the biggest threat to the players?',
        'Is there a way to disable the trap?',
      ],
      type: 'starting',
    },
    {
      id: 'tricks_of_the_trade',
      name: 'Tricks of the Trade',
      description:
        'When you pick locks or disable traps, roll+DEX. On a 10+, you do it, no problem. On a 7-9, you still do it, but the GM will offer you two options between suspicion, danger, or cost.',
      type: 'starting',
    },
    {
      id: 'stealthy',
      name: 'Stealthy',
      description:
        "When you keep to the shadows and the edge of attention, roll+DEX. On a 10+, you're gone. On a 7-9, you're gone, but the GM will offer you a worse outcome, hard bargain, or ugly choice.",
      type: 'starting',
    },
    {
      id: 'underdog',
      name: 'Underdog',
      description: 'When you fight a group of enemies, you deal +1d6 damage against them.',
      type: 'starting',
    },
  ],

  // Advanced moves (selected through leveling)
  advancedMoves: [
    {
      id: 'flexible_morals',
      name: 'Flexible Morals',
      description: 'When you help someone who has helped you, you mark XP.',
      level: 2,
      type: 'advanced',
    },
    {
      id: 'poisoner',
      name: 'Poisoner',
      description:
        'You can make and apply poisons. When you apply a poison to a weapon, the next time that weapon deals damage, the target takes +1d4 damage and is weakened.',
      level: 2,
      type: 'advanced',
    },
    {
      id: 'wealth_and_taste',
      name: 'Wealth and Taste',
      description:
        'When you make a show of flashing around your most valuable piece of treasure, roll+CHA. On a 10+, choose 3. On a 7-9, choose 1:',
      choices: [
        'Someone here is definitely into you',
        'Someone here is definitely into your treasure',
        'Someone here is definitely into your connections',
        'Someone here is definitely into your skills',
      ],
      level: 2,
      type: 'advanced',
    },
    {
      id: 'multiclass_dabbler',
      name: 'Multiclass Dabbler',
      description:
        'Get one move from another class. Treat your level as one lower for choosing the move.',
      level: 3,
      type: 'advanced',
    },
    {
      id: 'cautious',
      name: 'Cautious',
      description: 'When you scout ahead, you take +1 forward.',
      level: 3,
      type: 'advanced',
    },
    {
      id: 'connections',
      name: 'Connections',
      description:
        "When you put out word to your criminal contacts, roll+CHA. On a 10+, someone has a useful rumor or job for you. On a 7-9, the same, but it's not free.",
      level: 4,
      type: 'advanced',
    },
    {
      id: 'heist',
      name: 'Heist',
      description:
        'When you take time to case a location, roll+INT. On a 10+, hold 3. On a 7-9, hold 1. Spend your hold to ask the GM questions about the location:',
      choices: [
        "What's the most valuable thing here?",
        "What's the best way in?",
        "What's the best way out?",
        "Who's in charge here?",
      ],
      level: 4,
      type: 'advanced',
    },
    {
      id: 'vanish',
      name: 'Vanish',
      description:
        "When you are in a place you could reasonably escape from, you can vanish without a roll. The GM will tell you when you're spotted or what you leave behind.",
      level: 5,
      type: 'advanced',
    },
    {
      id: 'reflexes',
      name: 'Reflexes',
      description: 'You have +1 armor.',
      level: 5,
      type: 'advanced',
    },
    {
      id: 'perfect_plan',
      name: 'Perfect Plan',
      description:
        'When you make a plan, you can ask the GM one question about the plan. The GM will answer honestly.',
      level: 6,
      type: 'advanced',
    },
  ],

  // Class-specific mechanics
  mechanics: {
    // Specialized equipment
    specializedGear: [
      'Grappling Hook',
      'Smoke Bombs',
      'Acid Vials',
      'Caltrops',
      'Mirror',
      'Chalk',
      'Wire',
      'Lockpicks',
    ],

    // Poison types
    poisonTypes: [
      'Paralytic (target cannot move for 1d4 rounds)',
      'Nerve (target takes -1 ongoing to all rolls)',
      'Blood (target takes 1d4 ongoing damage)',
      'Sleep (target falls unconscious for 1d4 hours)',
    ],
  },
};
