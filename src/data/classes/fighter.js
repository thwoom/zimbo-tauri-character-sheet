export const fighter = {
  name: 'Fighter',
  description: 'A master of martial combat, skilled with a variety of weapons and armor.',

  // Starting character template
  template: {
    level: 1,
    hp: 25,
    maxHp: 25,
    xp: 0,
    xpNeeded: 8,
    levelUpPending: false,
    armor: 1,
    secondaryResource: 0,
    maxSecondaryResource: 0,

    stats: {
      STR: { score: 16, mod: 2 },
      DEX: { score: 13, mod: 1 },
      CON: { score: 15, mod: 1 },
      INT: { score: 12, mod: 0 },
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
        name: 'Signature Weapon',
        type: 'weapon',
        damage: 'd8',
        equipped: true,
        description: 'Your chosen weapon, perfectly balanced and deadly',
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
        description: 'Heavy armor that protects well but limits mobility',
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
  },

  // Starting moves (always available)
  startingMoves: [
    {
      id: 'bend_bars_lift_gates',
      name: 'Bend Bars, Lift Gates',
      description:
        'When you use pure strength to destroy an inanimate obstacle, roll+STR. On a 10+, choose 3. On a 7-9, choose 1. On a miss, something goes horribly wrong.',
      choices: [
        "It doesn't take a very long time",
        'Nothing of value is damaged',
        "It doesn't make an inordinate amount of noise",
        'You can fix the thing again without a lot of effort',
      ],
      type: 'starting',
    },
    {
      id: 'armored',
      name: 'Armored',
      description: 'You ignore the clumsy tag on armor you wear.',
      type: 'starting',
    },
    {
      id: 'signature_weapon',
      name: 'Signature Weapon',
      description:
        'This is your weapon. There are many like it, but this one is yours. Your weapon is your best friend. It is your life. You master it as you master your life. Your weapon, without you, is useless. Without your weapon, you are useless.',
      type: 'starting',
    },
    {
      id: 'defender',
      name: 'Defender',
      description: 'When you protect someone else on your turn, you mark XP if you roll a 6-.',
      type: 'starting',
    },
    {
      id: 'through_death_s_fears',
      name: "Through Death's Fears",
      description:
        'When you hack and slash, you choose one option in addition to the normal effects:',
      choices: [
        'Reduce their armor by 1 until they repair it',
        'Sunder their weapon or shield (your choice)',
        'Drive them back',
        'Trade damage for positioning',
      ],
      type: 'starting',
    },
  ],

  // Advanced moves (selected through leveling)
  advancedMoves: [
    {
      id: 'heirloom',
      name: 'Heirloom',
      description:
        'When you consult the spirits that reside within your signature weapon, they will give you an insight about the current situation, and might ask you some questions in return. Mark 1 XP if you listen.',
      level: 2,
      type: 'advanced',
    },
    {
      id: 'improved_weapon',
      name: 'Improved Weapon',
      description: 'Choose one extra option from your signature weapon.',
      level: 2,
      type: 'advanced',
    },
    {
      id: 'armor_mastery',
      name: 'Armor Mastery',
      description: 'You ignore the clumsy tag on any armor you wear.',
      level: 2,
      type: 'advanced',
    },
    {
      id: 'devastating',
      name: 'Devastating',
      description: 'When you hack and slash, choose an extra option, even on a miss.',
      level: 3,
      type: 'advanced',
    },
    {
      id: 'merciless',
      name: 'Merciless',
      description: 'When you deal damage, deal +1d4 damage.',
      level: 3,
      type: 'advanced',
    },
    {
      id: 'bloodthirsty',
      name: 'Bloodthirsty',
      description:
        'When you hack and slash, you can choose to add the messy tag to your weapon for the rest of the battle. If you do, deal +1d4 damage.',
      level: 4,
      type: 'advanced',
    },
    {
      id: 'eye_for_weakness',
      name: 'Eye for Weakness',
      description: 'When you discern realities in combat, you take +1 forward to deal damage.',
      level: 4,
      type: 'advanced',
    },
    {
      id: 'multiclass_dabbler',
      name: 'Multiclass Dabbler',
      description:
        'Get one move from another class. Treat your level as one lower for choosing the move.',
      level: 5,
      type: 'advanced',
    },
    {
      id: 'weapon_master',
      name: 'Weapon Master',
      description:
        'Choose a new signature weapon (as per the signature weapon move). You can switch between signature weapons when you take a short rest.',
      level: 5,
      type: 'advanced',
    },
    {
      id: 'perfect_strike',
      name: 'Perfect Strike',
      description:
        'When you hack and slash, on a 12+ you deal your damage, avoid their attack, and impress, dismay, or frighten your enemy.',
      level: 6,
      type: 'advanced',
    },
  ],

  // Class-specific mechanics
  mechanics: {
    // Signature weapon options
    signatureWeaponOptions: [
      'Huge (messy, forceful)',
      'Perfectly balanced (+1 damage)',
      'Serrated edge (messy)',
      'Sharp (+1 damage)',
      'Well-crafted (+1 damage)',
      'Serious (+1 damage)',
      'Glowing (+1 damage)',
      'Ancient (+1 damage)',
      'Unbreakable',
      'Guided (+1 damage)',
      'Terrifying (+1 damage)',
      'Defensive (+1 armor)',
      'Intelligent (+1 damage)',
      'Stealthy (quick)',
      'Blood-seeking (+1 damage)',
    ],

    // Armor options
    armorOptions: [
      { name: 'Leather', armor: 1, tags: [] },
      { name: 'Chainmail', armor: 2, tags: ['clumsy'] },
      { name: 'Scale', armor: 2, tags: ['clumsy'] },
      { name: 'Plate', armor: 3, tags: ['clumsy'] },
    ],
  },
};
