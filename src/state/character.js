import {
  FaSkull,
  FaBolt,
  FaFire,
  FaSnowflake,
  FaQuestion,
  FaWeightHanging,
  FaStar,
  FaGhost,
  FaDumbbell,
  FaArrowsLeftRight,
  FaHeadSideVirus,
  FaBrain,
  FaFaceFrownOpen,
} from 'react-icons/fa6';
import { CLASS_DATA } from '../data/classData.js';

export const RULEBOOK = 'Dungeon World';

export const INITIAL_CHARACTER_DATA = {
  // Basic Info
  level: 4,
  hp: 15,
  maxHp: 25,
  xp: 4,
  xpNeeded: 11, // Formula: level + 7
  levelUpPending: false,
  armor: 0,
  secondaryResource: 0,
  maxSecondaryResource: 0,
  class: 'Fighter',
  baseLoad: CLASS_DATA.Fighter.baseLoad,

  // Attributes
  stats: {
    STR: { score: 18, mod: 3 }, // mod = Math.floor((score - 10) / 2)
    DEX: { score: 15, mod: 1 },
    CON: { score: 16, mod: 2 },
    INT: { score: 9, mod: 0 },
    WIS: { score: 13, mod: 1 },
    CHA: { score: 8, mod: -1 },
  },

  // Resources & Abilities
  resources: {
    coin: 0,
    chronoUses: 2, // Ring of Smooshed Chronologies
    paradoxPoints: 0, // 0-3, 3 = reality unstable
    bandages: 3, // Heal 4 HP slowly
    rations: 5, // Satisfy hunger at camp
    advGear: 5, // Rope, torches, chalk, etc.
    ammo: 3, // Ammunition for ranged weapons
  },

  // Character Relationships
  bonds: [
    { name: 'Sar', relationship: 'I will teach Sar about the future', resolved: false },
    { name: 'Kael', relationship: 'Kael reminds me of someone I lost', resolved: false },
  ],

  // Status Conditions
  statusEffects: [], // Keys: poisoned, burning, shocked, frozen, blessed, confused, weakened, invisible
  debilities: [], // Keys: weak, shaky, sick, stunned, confused, scarred

  // Equipment & Items
  inventory: [
    {
      id: 1,
      name: 'Entropic Cyber-Warhammer',
      type: 'weapon',
      slot: 'Weapon',
      damage: 'd10+3',
      equipped: true,
      description: 'Phases through time occasionally',
      tags: ['melee', 'forceful', 'messy'],
      weight: 2,
      magical: true,
      addedAt: new Date().toISOString(),
      notes: '',
    },
    {
      id: 2,
      name: 'Ring of Smooshed Chronologies',
      type: 'magic',
      slot: 'Ring',
      equipped: true,
      description: 'Grants Chrono-Retcon ability',
      weight: 0,
      magical: true,
      addedAt: new Date().toISOString(),
      notes: '',
    },
    {
      id: 3,
      name: 'Gravity Beetle Shell',
      type: 'material',
      quantity: 1,
      description: "Crafting material for Sar's companion Kumquat",
      weight: 1,
      addedAt: new Date().toISOString(),
      notes: '',
    },
    {
      id: 4,
      name: 'Healing Potion',
      type: 'consumable',
      quantity: 2,
      description: 'Restore 1d8 HP',
      weight: 1,
      addedAt: new Date().toISOString(),
      notes: '',
    },
    {
      id: 5,
      name: 'Cyber-Plated Vest',
      type: 'armor',
      slot: 'Chest',
      armor: 1,
      equipped: false,
      description: 'Light armor with energy dispersal',
      weight: 2,
      addedAt: new Date().toISOString(),
      notes: '',
    },
  ],

  // Character Progression
  selectedMoves: [], // Advanced moves acquired through leveling
  actionHistory: [], // For undo functionality (last 5 actions)

  // Session Data
  sessionNotes: '', // Campaign notes and events
  sessionRecapPublic: '', // Shareable session recap
  rollHistory: [], // Recent dice rolls (last 10)
  lastSessionEnd: null, // ISO timestamp when session last ended
  sessionRecap: '', // Summary of last session
};

export const statusEffectTypes = {
  poisoned: { name: 'Poisoned', description: '-1 to all rolls', color: 'green', icon: FaSkull },
  shocked: { name: 'Shocked', description: '-2 to DEX rolls', color: 'blue-yellow', icon: FaBolt },
  burning: {
    name: 'Burning',
    description: 'Fire damage each turn',
    color: 'red-orange',
    icon: FaFire,
  },
  frozen: {
    name: 'Frozen',
    description: '-1 to physical actions',
    color: 'cyan-blue',
    icon: FaSnowflake,
  },
  confused: {
    name: 'Confused',
    description: 'GM controls one action',
    color: 'purple',
    icon: FaQuestion,
  },
  weakened: {
    name: 'Weakened',
    description: '-1 to damage rolls',
    color: 'gray',
    icon: FaWeightHanging,
  },
  blessed: { name: 'Blessed', description: '+1 to all rolls', color: 'yellow', icon: FaStar },
  invisible: {
    name: 'Invisible',
    description: 'Cannot be targeted',
    color: 'transparent',
    icon: FaGhost,
  },
};

export const debilityTypes = {
  weak: { name: 'Weak', description: '-1 to STR rolls', icon: FaDumbbell },
  shaky: { name: 'Shaky', description: '-1 to DEX rolls', icon: FaArrowsLeftRight },
  sick: { name: 'Sick', description: '-1 to CON rolls', icon: FaHeadSideVirus },
  stunned: { name: 'Stunned', description: '-1 to INT rolls', icon: FaBrain },
  confused: { name: 'Confused', description: '-1 to WIS rolls', icon: FaQuestion },
  scarred: { name: 'Scarred', description: '-1 to CHA rolls', icon: FaFaceFrownOpen },
};
