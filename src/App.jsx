import React, { useState, useEffect } from "react";
import "./App.css";
import LevelUpModal from "./components/LevelUpModal";

// Initial character data based on Zimbo's character sheet
const INITIAL_CHARACTER_DATA = {
  // Basic Info
  level: 4,
  hp: 15,
  maxHp: 25,
  xp: 4,
  xpNeeded: 12, // Formula: (level + 1) * 7
  armor: 0,

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
    chronoUses: 2, // Ring of Smooshed Chronologies
    paradoxPoints: 0, // 0-3, 3 = reality unstable
    bandages: 3, // Heal 4 HP slowly
    rations: 5, // Satisfy hunger at camp
    advGear: 5, // Rope, torches, chalk, etc.
  },

  // Character Relationships
  bonds: [
    {
      name: "Sar",
      relationship: "I will teach Sar about the future",
      resolved: false,
    },
    {
      name: "Kael",
      relationship: "Kael reminds me of someone I lost",
      resolved: false,
    },
  ],

  // Status Conditions
  statusEffects: [], // Keys: poisoned, shocked, burning, frozen, confused, weakened, blessed, invisible
  debilities: [], // Keys: weak, shaky, sick, stunned, confused, scarred

  // Equipment & Items
  inventory: [
    {
      id: 1,
      name: "Entropic Cyber-Warhammer",
      type: "weapon",
      damage: "d10+3",
      equipped: true,
      description: "Phases through time occasionally",
      tags: ["melee", "forceful", "messy"],
    },
    {
      id: 2,
      name: "Ring of Smooshed Chronologies",
      type: "magic",
      equipped: true,
      description: "Grants Chrono-Retcon ability",
    },
    {
      id: 3,
      name: "Gravity Beetle Shell",
      type: "material",
      quantity: 1,
      description: "Crafting material for Sar's companion Kumquat",
    },
    {
      id: 4,
      name: "Healing Potion",
      type: "consumable",
      quantity: 2,
      description: "Restore 1d8 HP",
    },
    {
      id: 5,
      name: "Cyber-Plated Vest",
      type: "armor",
      armor: 1,
      equipped: false,
      description: "Light armor with energy dispersal",
    },
  ],

  // Character Progression
  selectedMoves: [], // Advanced moves acquired through leveling
  actionHistory: [], // For undo functionality (last 5 actions)

  // Session Data
  sessionNotes: "", // Campaign notes and events
  rollHistory: [], // Recent dice rolls (last 10)
};

// Status Effects and Debilities Definitions
const statusEffectTypes = {
  poisoned: {
    name: "Poisoned",
    description: "-1 to all rolls",
    color: "green",
    icon: "🤢",
  },
  shocked: {
    name: "Shocked",
    description: "-2 to DEX rolls",
    color: "blue-yellow",
    icon: "⚡",
  },
  burning: {
    name: "Burning",
    description: "Fire damage each turn",
    color: "red-orange",
    icon: "🔥",
  },
  frozen: {
    name: "Frozen",
    description: "-1 to physical actions",
    color: "cyan-blue",
    icon: "🧊",
  },
  confused: {
    name: "Confused",
    description: "GM controls one action",
    color: "purple",
    icon: "😵",
  },
  weakened: {
    name: "Weakened",
    description: "-1 to damage rolls",
    color: "gray",
    icon: "💔",
  },
  blessed: {
    name: "Blessed",
    description: "+1 to all rolls",
    color: "yellow",
    icon: "✨",
  },
  invisible: {
    name: "Invisible",
    description: "Cannot be targeted",
    color: "transparent",
    icon: "👻",
  },
};

const debilityTypes = {
  weak: { name: "Weak", description: "-1 to STR rolls", icon: "💪" },
  shaky: { name: "Shaky", description: "-1 to DEX rolls", icon: "🫨" },
  sick: { name: "Sick", description: "-1 to CON rolls", icon: "🤒" },
  stunned: { name: "Stunned", description: "-1 to INT rolls", icon: "😵‍💫" },
  confused: { name: "Confused", description: "-1 to WIS rolls", icon: "🤯" },
  scarred: { name: "Scarred", description: "-1 to CHA rolls", icon: "😰" },
};

// Advanced Moves Definition
const advancedMoves = {
  appetite: {
    name: "Appetite for Destruction",
    desc: "Take +1d4 damage ongoing to all enemies near something you destroy utterly.",
    expanded:
      "When you completely obliterate something impressive - a door, statue, or magical barrier - all enemies within near range take +1d4 ongoing damage from the flying debris and your terrifying display.",
    examples:
      "• Smash through a blast door to shower security drones with metal • Destroy a quantum pillar, causing energy arcs to damage nearby cyber-cultists",
  },
  khan: {
    name: "Khan of Khans",
    desc: "Your hirelings always accept the gratuitous fulfillment of one of your appetites as payment.",
    expanded:
      "Instead of paying hirelings with coin, you can satisfy them by indulging your appetites (Destruction & Arcane Secrets) in a dramatic way.",
    examples:
      "• Hire a tech-scavenger by promising to break ancient AI seals • Pay mercenaries by letting them watch you decode alien technology",
  },
  thick_skin: {
    name: "Thick Skin",
    desc: "You gain +1 armor or replace this move with getting +1 armor and +1 HP.",
    expanded:
      "Your cybernetic enhancements and harsh experiences have toughened you. Choose either +1 armor permanently, OR replace this move to get both +1 armor and +1 HP.",
    examples:
      "• Cyber-skin hardens against plasma weapons • Subdermal plating deflects energy blasts • Enhanced healing factors close laser wounds faster",
  },
  berserker: {
    name: "Berserker",
    desc: "When you deal damage while in combat, take +1 forward to your next move.",
    expanded:
      "Every successful hit fuels your combat fury, making your next action more effective. This creates escalating momentum in fights.",
    examples:
      "• Cyber-hammer strike energizes your dodge protocols • Successful intimidation improves your next plasma shot • Landing damage makes your temporal shift more effective",
  },
  eye_for_weakness: {
    name: "Eye for Weakness",
    desc: "When you discern realities in combat, you take +1 forward to deal damage.",
    expanded:
      "Your combat experience lets you spot vulnerabilities in enemies. Studying them in battle reveals openings for devastating attacks.",
    examples:
      "• Notice weak points in power armor • Spot timing gaps in android defenses • Identify quantum field vulnerabilities",
  },
  multiclass_dabbler: {
    name: "Multiclass Dabbler",
    desc: "Get one move from another class. Treat your level as one lower for choosing the move.",
    expanded:
      "Your varied experiences allow you to pick up techniques from other adventuring traditions. Choose any move from Fighter, Thief, Wizard, etc.",
    examples:
      "• Fighter moves for plasma weapon mastery • Wizard quantum-spells for temporal power • Thief skills for hacking and infiltration",
  },
};

function App() {
  // Main Character State
  const [character, setCharacter] = useState(INITIAL_CHARACTER_DATA);

  // UI State Management
  const [expandedMoves, setExpandedMoves] = useState({});
  const [rollResult, setRollResult] = useState("Ready to roll!");
  const [showRollModal, setShowRollModal] = useState(false);
  const [rollModalData, setRollModalData] = useState({});
  const [rollHistory, setRollHistory] = useState([]);
  const [sessionNotes, setSessionNotes] = useState("");

  // Modal States
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showBondsModal, setShowBondsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Additional UI State
  const [damageInput, setDamageInput] = useState("");
  const [compactMode, setCompactMode] = useState(false);

  // Level Up State
  const [levelUpState, setLevelUpState] = useState({
    selectedStats: [],
    selectedMove: "",
    hpIncrease: 0,
    newLevel: 5,
    expandedMove: "",
  });

  // Auto-detect level up opportunity
  useEffect(() => {
    if (character.xp >= character.xpNeeded && !showLevelUpModal) {
      setShowLevelUpModal(true);
      setLevelUpState((prev) => ({ ...prev, newLevel: character.level + 1 }));
    }
  }, [character.xp, character.xpNeeded, character.level, showLevelUpModal]);

  // Utility Functions
  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

  const getTotalArmor = () => {
    const baseArmor = character.armor || 0;
    const equippedArmor = character.inventory
      .filter((item) => item.equipped && item.armor)
      .reduce((total, item) => total + (item.armor || 0), 0);
    return baseArmor + equippedArmor;
  };

  const getEquippedWeaponDamage = () => {
    const weapon = character.inventory.find(
      (item) => item.equipped && item.type === "weapon",
    );
    return weapon ? weapon.damage || "d6" : "d6";
  };

  // Get status effect modifiers
  const getStatusModifiers = (rollType = "general") => {
    let modifier = 0;
    let notes = [];

    if (character.statusEffects.includes("poisoned")) {
      modifier -= 1;
      notes.push("Poisoned (-1)");
    }
    if (character.statusEffects.includes("shocked") && rollType === "dex") {
      modifier -= 2;
      notes.push("Shocked (-2 DEX)");
    }
    if (character.statusEffects.includes("weakened") && rollType === "damage") {
      modifier -= 1;
      notes.push("Weakened (-1 damage)");
    }
    if (
      character.statusEffects.includes("frozen") &&
      (rollType === "str" || rollType === "dex")
    ) {
      modifier -= 1;
      notes.push("Frozen (-1 physical)");
    }
    if (character.statusEffects.includes("blessed")) {
      modifier += 1;
      notes.push("Blessed (+1)");
    }

    // Add debility modifiers
    character.debilities.forEach((debility) => {
      if (
        (debility === "weak" && rollType === "str") ||
        (debility === "shaky" && rollType === "dex") ||
        (debility === "sick" && rollType === "con") ||
        (debility === "stunned" && rollType === "int") ||
        (debility === "confused" && rollType === "wis") ||
        (debility === "scarred" && rollType === "cha")
      ) {
        modifier -= 1;
        notes.push(`${debilityTypes[debility].name} (-1)`);
      }
    });

    return { modifier, notes };
  };

  // Core Dice Rolling System
  const rollDice = (formula, description = "") => {
    let result = "";
    let total = 0;
    let interpretation = "";
    let context = "";

    if (formula.includes("2d6")) {
      const die1 = rollDie(6);
      const die2 = rollDie(6);
      const baseModifier = parseInt(
        formula.replace("2d6", "").replace("+", "") || "0",
      );

      // Determine roll type for status effects
      let rollType = "general";
      if (description.includes("STR") || description.includes("Hack"))
        rollType = "str";
      else if (description.includes("DEX")) rollType = "dex";
      else if (description.includes("CON")) rollType = "con";
      else if (description.includes("INT")) rollType = "int";
      else if (description.includes("WIS")) rollType = "wis";
      else if (description.includes("CHA")) rollType = "cha";
      else if (
        description.includes("damage") ||
        description.includes("Damage") ||
        description.includes("Upper Hand") ||
        description.includes("Bonus Damage")
      )
        rollType = "damage";

      const statusMods = getStatusModifiers(rollType);
      const totalModifier = baseModifier + statusMods.modifier;
      total = die1 + die2 + totalModifier;

      result = `2d6: [${die1}, ${die2}]`;
      if (baseModifier !== 0) {
        result += ` ${baseModifier >= 0 ? "+" : ""}${baseModifier}`;
      }
      if (statusMods.modifier !== 0) {
        result += ` ${statusMods.modifier >= 0 ? "+" : ""}${statusMods.modifier}`;
      }
      result += ` = ${total}`;

      if (statusMods.notes.length > 0) {
        result += ` (${statusMods.notes.join(", ")})`;
      }

      // Dungeon World success thresholds
      if (total >= 10) {
        interpretation = " ✅ Success!";
        context = getSuccessContext(description);
      } else if (total >= 7) {
        interpretation = " ⚠️ Partial Success";
        context = getPartialContext(description);
      } else {
        interpretation = " ❌ Failure";
        context = getFailureContext(description);
      }
    } else if (formula.startsWith("d")) {
      const sides = parseInt(formula.replace("d", "").split("+")[0]);
      const baseModifier = parseInt(formula.split("+")[1] || "0");
      const roll = rollDie(sides);

      const rollType =
        description.includes("damage") || description.includes("Damage")
          ? "damage"
          : "general";
      const statusMods = getStatusModifiers(rollType);
      const totalModifier = baseModifier + statusMods.modifier;
      total = roll + totalModifier;

      result = `d${sides}: ${roll}`;
      if (baseModifier !== 0) {
        result += ` +${baseModifier}`;
      }
      if (statusMods.modifier !== 0) {
        result += ` ${statusMods.modifier >= 0 ? "+" : ""}${statusMods.modifier}`;
      }
      result += ` = ${total}`;

      if (statusMods.notes.length > 0) {
        result += ` (${statusMods.notes.join(", ")})`;
      }
    }

    const rollData = {
      result: result + interpretation,
      description,
      context,
      total,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Add to roll history (keep last 10)
    setRollHistory((prev) => [rollData, ...prev.slice(0, 9)]);
    setRollModalData(rollData);
    setShowRollModal(true);
  };

  // Context helpers for roll results
  const getSuccessContext = (description) => {
    if (description.includes("STR"))
      return "Power through with overwhelming force!";
    if (description.includes("DEX")) return "Graceful and precise execution!";
    if (description.includes("CON")) return "Tough as cybernetic nails!";
    if (description.includes("INT")) return "Brilliant tactical insight!";
    if (description.includes("WIS")) return "Crystal clear perception!";
    if (description.includes("CHA"))
      return "Surprisingly charming for a cyber-barbarian!";
    if (description.includes("Hack")) return "Clean hit, enemy can't counter!";
    if (description.includes("Taunt"))
      return "They're completely focused on you now!";
    return "Perfect execution!";
  };

  const getPartialContext = (description) => {
    if (description.includes("STR"))
      return "Success, but strain yourself or equipment";
    if (description.includes("DEX"))
      return "Stumble slightly, awkward position";
    if (description.includes("CON")) return "Feel the strain, maybe take harm";
    if (description.includes("INT")) return "Confusing situation, partial info";
    if (description.includes("WIS"))
      return "Something seems off, can't quite tell what";
    if (description.includes("CHA"))
      return "Awkward interaction, mixed signals";
    if (description.includes("Hack")) return "Hit them, but they hit you back!";
    if (description.includes("Taunt"))
      return "They attack you but with +1 ongoing damage!";
    return "Success with complications";
  };

  const getFailureContext = (description) => {
    if (description.includes("STR"))
      return "Too heavy, equipment fails, or overpower backfires";
    if (description.includes("DEX"))
      return "Trip, fumble, or end up in worse position";
    if (description.includes("CON"))
      return "Exhausted, hurt, or overcome by conditions";
    if (description.includes("INT"))
      return "No clue, wrong conclusion, or miss key detail";
    if (description.includes("WIS")) return "Completely missed the signs";
    if (description.includes("CHA"))
      return "Offensive, rude, or make things worse";
    if (description.includes("Hack")) return "Miss entirely, terrible position";
    if (description.includes("Taunt")) return "They ignore you completely";
    return "Things go badly";
  };

  // Undo System
  const saveToHistory = (action) => {
    setCharacter((prev) => ({
      ...prev,
      actionHistory: [
        { action, state: prev, timestamp: Date.now() },
        ...prev.actionHistory.slice(0, 4), // Keep last 5 actions
      ],
    }));
  };

  const undoLastAction = () => {
    if (character.actionHistory.length > 0) {
      const lastAction = character.actionHistory[0];
      setCharacter(lastAction.state);
      setRollResult(`↶ Undid: ${lastAction.action}`);
      setTimeout(() => setRollResult("Ready to roll!"), 2000);
    }
  };

  // Visual effects based on status
  const getActiveVisualEffects = () => {
    if (character.statusEffects.includes("poisoned")) return "poisoned-overlay";
    if (character.statusEffects.includes("burning")) return "burning-overlay";
    if (character.statusEffects.includes("shocked")) return "shocked-overlay";
    if (character.statusEffects.includes("frozen")) return "frozen-overlay";
    if (character.statusEffects.includes("blessed")) return "blessed-overlay";
    return "";
  };

  const getHeaderColor = () => {
    if (character.statusEffects.includes("poisoned"))
      return "linear-gradient(45deg, #22c55e, #059669, #00d4aa)";
    if (character.statusEffects.includes("burning"))
      return "linear-gradient(45deg, #ef4444, #f97316, #fbbf24)";
    if (character.statusEffects.includes("shocked"))
      return "linear-gradient(45deg, #3b82f6, #eab308, #00d4aa)";
    if (character.statusEffects.includes("frozen"))
      return "linear-gradient(45deg, #06b6d4, #3b82f6, #6366f1)";
    if (character.statusEffects.includes("blessed"))
      return "linear-gradient(45deg, #fbbf24, #f59e0b, #00d4aa)";
    return "linear-gradient(45deg, #6366f1, #8b5cf6, #00d4aa)"; // default
  };

  // Styles using inline styles for Tauri compatibility
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    color: "#e0e0e0",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "30px",
    padding: "20px",
    background: getHeaderColor(),
    borderRadius: "15px",
    border: "2px solid #00ff88",
    boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
    transition: "all 0.5s ease",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  };

  const panelStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(0, 255, 136, 0.3)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  };

  const buttonStyle = {
    background: "linear-gradient(45deg, #00ff88, #00cc6a)",
    border: "none",
    borderRadius: "6px",
    color: "white",
    padding: "8px 15px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    margin: "5px",
  };

  return (
    <div style={containerStyle} className={getActiveVisualEffects()}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={headerStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "10px",
                  textShadow: "0 0 10px #00ff88",
                }}
              >
                🧾 ZIMBO – The Time-Bound Juggernaut
              </h1>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <p>
                  Barbarian-Wizard Hybrid | Level {character.level} | Neutral
                  Good
                </p>
                {character.statusEffects.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      padding: "5px 10px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: "20px",
                    }}
                  >
                    {character.statusEffects.map((effect) => (
                      <span
                        key={effect}
                        title={statusEffectTypes[effect]?.name}
                        style={{
                          fontSize: "18px",
                          animation: "pulse 2s infinite",
                        }}
                      >
                        {statusEffectTypes[effect]?.icon}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={undoLastAction}
                disabled={character.actionHistory.length === 0}
                style={{
                  ...buttonStyle,
                  background:
                    character.actionHistory.length > 0
                      ? "linear-gradient(45deg, #6b7280, #4b5563)"
                      : "linear-gradient(45deg, #374151, #6b7280)",
                  opacity: character.actionHistory.length > 0 ? 1 : 0.5,
                  cursor:
                    character.actionHistory.length > 0
                      ? "pointer"
                      : "not-allowed",
                }}
                title="Undo last action"
              >
                ↶ Undo
              </button>
              <button
                onClick={() => setShowDamageModal(true)}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #ef4444, #dc2626)",
                }}
              >
                💔 Take Damage
              </button>
              <button
                onClick={() => setShowStatusModal(true)}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #f97316, #ea580c)",
                }}
              >
                💀 Effects (
                {character.statusEffects.length + character.debilities.length})
              </button>
              <button
                onClick={() => setShowInventoryModal(true)}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
                }}
              >
                🎒 Inventory
              </button>
              <button
                onClick={() => setShowBondsModal(true)}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #3b82f6, #2563eb)",
                }}
              >
                👥 Bonds ({character.bonds.filter((b) => !b.resolved).length})
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div style={gridStyle}>
          {/* Stats Panel */}
          <div style={panelStyle}>
            <h3
              style={{
                color: "#00ff88",
                marginBottom: "15px",
                fontSize: "1.3rem",
              }}
            >
              ⚡ Stats & Health
            </h3>

            {/* Stats Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              {Object.entries(character.stats).map(([stat, data]) => (
                <div
                  key={stat}
                  style={{
                    textAlign: "center",
                    background: "rgba(0, 0, 0, 0.3)",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 255, 136, 0.3)",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "#aaa" }}>
                    {stat}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#00ff88",
                    }}
                  >
                    {data.score} ({data.mod >= 0 ? "+" : ""}
                    {data.mod})
                  </div>
                </div>
              ))}
            </div>

            {/* HP Bar */}
            <div
              style={{
                width: "100%",
                height: "25px",
                background: "#333",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid #555",
                margin: "10px 0",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #ff4444, #ffaa44)",
                  width: `${(character.hp / character.maxHp) * 100}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              HP: {character.hp}/{character.maxHp} | Armor: {getTotalArmor()}
            </div>

            {/* HP Controls */}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                onClick={() => {
                  saveToHistory("HP Change");
                  setCharacter((prev) => ({
                    ...prev,
                    hp: Math.min(prev.maxHp, prev.hp + 1),
                  }));
                }}
                style={buttonStyle}
              >
                +1 HP
              </button>
              <button
                onClick={() => {
                  saveToHistory("HP Change");
                  setCharacter((prev) => ({
                    ...prev,
                    hp: Math.max(0, prev.hp - 1),
                  }));
                }}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #ef4444, #dc2626)",
                }}
              >
                -1 HP
              </button>
            </div>

            {/* XP Bar */}
            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#333",
                borderRadius: "10px",
                overflow: "hidden",
                margin: "15px 0 10px 0",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #4a90ff, #00ff88)",
                  width: `${(character.xp / character.xpNeeded) * 100}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              XP: {character.xp}/{character.xpNeeded} (Level {character.level})
            </div>

            {/* XP Controls */}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                onClick={() =>
                  setCharacter((prev) => ({ ...prev, xp: prev.xp + 1 }))
                }
                style={buttonStyle}
              >
                +1 XP
              </button>
              <button
                onClick={() =>
                  setCharacter((prev) => ({
                    ...prev,
                    xp: Math.max(0, prev.xp - 1),
                  }))
                }
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #ef4444, #dc2626)",
                }}
              >
                -1 XP
              </button>
            </div>

            {/* Level Up Alert */}
            {character.xp >= character.xpNeeded && (
              <button
                onClick={() => setShowLevelUpModal(true)}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #fbbf24, #f59e0b)",
                  width: "100%",
                  marginTop: "15px",
                  padding: "15px",
                  fontSize: "16px",
                  animation: "pulse 2s infinite",
                }}
              >
                🎉 LEVEL UP AVAILABLE!
              </button>
            )}
          </div>

          {/* Resources Panel */}
          <div style={panelStyle}>
            <h3
              style={{
                color: "#00ff88",
                marginBottom: "15px",
                fontSize: "1.3rem",
              }}
            >
              🔋 Resources
            </h3>

            {/* Chrono-Retcon */}
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <span style={{ fontWeight: "bold" }}>Chrono-Retcon Uses:</span>
                <span style={{ color: "#00ff88", fontWeight: "bold" }}>
                  {character.resources.chronoUses}/2
                </span>
              </div>
              <button
                onClick={() => {
                  if (character.resources.chronoUses > 0) {
                    setCharacter((prev) => ({
                      ...prev,
                      resources: {
                        ...prev.resources,
                        chronoUses: prev.resources.chronoUses - 1,
                      },
                    }));
                    setRollResult(
                      "⏰ Chrono-Retcon activated - rewrite any recent action!",
                    );
                    setTimeout(() => setRollResult("Ready to roll!"), 3000);
                  } else {
                    setRollResult("❌ No uses remaining!");
                    setTimeout(() => setRollResult("Ready to roll!"), 2000);
                  }
                }}
                disabled={character.resources.chronoUses === 0}
                style={{
                  ...buttonStyle,
                  width: "100%",
                  background:
                    character.resources.chronoUses > 0
                      ? "linear-gradient(45deg, #10b981, #059669)"
                      : "linear-gradient(45deg, #6b7280, #374151)",
                  opacity: character.resources.chronoUses > 0 ? 1 : 0.5,
                  cursor:
                    character.resources.chronoUses > 0
                      ? "pointer"
                      : "not-allowed",
                }}
                title="Rewrite any recent action retroactively. Examples: 'Actually, I dodged that attack' or 'I already searched this room'"
              >
                ⏰ Use Chrono-Retcon
              </button>
            </div>

            {/* Other Resources */}
            {[
              {
                key: "paradoxPoints",
                label: "Paradox Points",
                max: 3,
                color: "#fbbf24",
              },
              { key: "bandages", label: "Bandages", max: 3, color: "#8b5cf6" },
              { key: "rations", label: "Rations", max: 5, color: "#f97316" },
              {
                key: "advGear",
                label: "Adventuring Gear",
                max: 5,
                color: "#06b6d4",
              },
            ].map(({ key, label, max, color }) => (
              <div key={key} style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                    {label}:
                  </span>
                  <span style={{ color, fontWeight: "bold" }}>
                    {character.resources[key]}/{max}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() =>
                      setCharacter((prev) => ({
                        ...prev,
                        resources: {
                          ...prev.resources,
                          [key]: Math.max(0, prev.resources[key] - 1),
                        },
                      }))
                    }
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(45deg, #ef4444, #dc2626)",
                      padding: "5px 10px",
                      margin: "0",
                      fontSize: "12px",
                      flex: "1",
                    }}
                  >
                    -1
                  </button>
                  <button
                    onClick={() =>
                      setCharacter((prev) => ({
                        ...prev,
                        resources: {
                          ...prev.resources,
                          [key]: Math.min(max, prev.resources[key] + 1),
                        },
                      }))
                    }
                    style={{
                      ...buttonStyle,
                      padding: "5px 10px",
                      margin: "0",
                      fontSize: "12px",
                      flex: "1",
                    }}
                  >
                    +1
                  </button>
                </div>
              </div>
            ))}

            {/* Paradox Warning */}
            {character.resources.paradoxPoints >= 3 && (
              <div
                style={{
                  background: "rgba(251, 191, 36, 0.2)",
                  border: "1px solid #fbbf24",
                  borderRadius: "6px",
                  padding: "10px",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    color: "#fbbf24",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  ⚠️ REALITY UNSTABLE! ⚠️
                </div>
              </div>
            )}

            {/* Reset All Button */}
            <button
              onClick={() => {
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    chronoUses: 2,
                    paradoxPoints: 0,
                    bandages: 3,
                    rations: 5,
                    advGear: 5,
                  },
                }));
                setRollResult("🔄 All resources restored!");
              }}
              style={{
                ...buttonStyle,
                width: "100%",
                marginTop: "15px",
                background: "linear-gradient(45deg, #4a90ff, #00ff88)",
                padding: "10px 20px",
              }}
            >
              🔄 Reset All Resources
            </button>
          </div>

          {/* Dice Roller Panel */}
          <div style={panelStyle}>
            <h3
              style={{
                color: "#00ff88",
                marginBottom: "15px",
                fontSize: "1.3rem",
              }}
            >
              🎲 Dice Roller
            </h3>

            {/* Stat Check Buttons */}
            <div style={{ marginBottom: "15px" }}>
              <h4
                style={{
                  color: "#00ff88",
                  marginBottom: "10px",
                  fontSize: "1rem",
                }}
              >
                Stat Checks
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "5px",
                }}
              >
                {Object.entries(character.stats).map(([stat, data]) => (
                  <button
                    key={stat}
                    onClick={() => rollDice(`2d6+${data.mod}`, `${stat} Check`)}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
                      padding: "8px 6px",
                      margin: "2px",
                      fontSize: "11px",
                    }}
                  >
                    {stat} ({data.mod >= 0 ? "+" : ""}
                    {data.mod})
                  </button>
                ))}
              </div>
            </div>

            {/* Combat Rolls */}
            <div style={{ marginBottom: "15px" }}>
              <h4
                style={{
                  color: "#00ff88",
                  marginBottom: "10px",
                  fontSize: "1rem",
                }}
              >
                Combat Rolls
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "5px",
                }}
              >
                <button
                  onClick={() =>
                    rollDice(getEquippedWeaponDamage(), "Weapon Damage")
                  }
                  style={{
                    ...buttonStyle,
                    background: "linear-gradient(45deg, #ef4444, #dc2626)",
                    margin: "2px",
                    fontSize: "11px",
                  }}
                >
                  Weapon ({getEquippedWeaponDamage()})
                </button>
                <button
                  onClick={() => rollDice("2d6+3", "Hack & Slash")}
                  style={{
                    ...buttonStyle,
                    background: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
                    margin: "2px",
                    fontSize: "11px",
                  }}
                >
                  Hack & Slash
                </button>
                <button
                  onClick={() => rollDice("d4", "Upper Hand")}
                  style={{
                    ...buttonStyle,
                    background: "linear-gradient(45deg, #f97316, #ea580c)",
                    margin: "2px",
                    fontSize: "11px",
                  }}
                >
                  Upper Hand d4
                </button>
                <button
                  onClick={() => rollDice("2d6-1", "Taunt")}
                  style={{
                    ...buttonStyle,
                    background: "linear-gradient(45deg, #eab308, #d97706)",
                    margin: "2px",
                    fontSize: "11px",
                  }}
                >
                  Taunt Enemy
                </button>
              </div>
            </div>

            {/* Basic Dice */}
            <div style={{ marginBottom: "15px" }}>
              <h4
                style={{
                  color: "#00ff88",
                  marginBottom: "10px",
                  fontSize: "1rem",
                }}
              >
                Basic Dice
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "5px",
                }}
              >
                {[4, 6, 8, 10, 12, 20].map((sides) => (
                  <button
                    key={sides}
                    onClick={() => rollDice(`d${sides}`)}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(45deg, #06b6d4, #0891b2)",
                      padding: "8px 4px",
                      margin: "2px",
                      fontSize: "11px",
                    }}
                  >
                    d{sides}
                  </button>
                ))}
              </div>
            </div>

            {/* Roll Result Display */}
            <div
              style={{
                background: "rgba(0, 255, 136, 0.2)",
                padding: "10px",
                borderRadius: "6px",
                textAlign: "center",
                fontWeight: "bold",
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {rollResult}
            </div>

            {/* Roll History */}
            {rollHistory.length > 0 && (
              <div style={{ marginTop: "10px", fontSize: "0.8rem" }}>
                <div style={{ color: "#00ff88", marginBottom: "5px" }}>
                  Recent Rolls:
                </div>
                {rollHistory.slice(0, 3).map((roll, index) => (
                  <div
                    key={index}
                    style={{ color: "#aaa", marginBottom: "2px" }}
                  >
                    <span style={{ color: "#00ff88" }}>{roll.timestamp}</span> -{" "}
                    {roll.result}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Inventory Panel */}
          <div style={panelStyle}>
            <h3
              style={{
                color: "#00ff88",
                marginBottom: "15px",
                fontSize: "1.3rem",
              }}
            >
              🎒 Equipment
            </h3>

            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {character.inventory.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    padding: "8px 12px",
                    margin: "5px 0",
                    borderRadius: "6px",
                    borderLeft: item.equipped
                      ? "3px solid #10b981"
                      : "3px solid #00ff88",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {item.type === "weapon" && "⚔️"}
                        {item.type === "magic" && "💍"}
                        {item.type === "consumable" && "🧪"}
                        {item.type === "armor" && "🛡️"}
                        {item.type === "material" && "📦"}
                        {(!item.type || item.type === "gear") && "🎒"}
                        {item.name}
                        {item.equipped && (
                          <span
                            style={{ color: "#10b981", fontSize: "0.7rem" }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#aaa" }}>
                        {item.damage && `${item.damage} damage`}
                        {item.armor && `+${item.armor} armor`}
                        {item.quantity > 1 && ` x${item.quantity}`}
                      </div>
                    </div>
                    {item.type === "consumable" && item.quantity > 0 && (
                      <button
                        onClick={() => {
                          if (item.name === "Healing Potion") {
                            const healing = rollDie(8);
                            const newHP = Math.min(
                              character.maxHp,
                              character.hp + healing,
                            );
                            setCharacter((prev) => ({
                              ...prev,
                              hp: newHP,
                              inventory: prev.inventory
                                .map((invItem) =>
                                  invItem.id === item.id
                                    ? {
                                        ...invItem,
                                        quantity: invItem.quantity - 1,
                                      }
                                    : invItem,
                                )
                                .filter(
                                  (invItem) =>
                                    invItem.type !== "consumable" ||
                                    invItem.quantity > 0,
                                ),
                            }));
                            setRollResult(
                              `Used ${item.name}: healed ${healing} HP!`,
                            );
                          }
                        }}
                        style={{
                          background:
                            "linear-gradient(45deg, #10b981, #059669)",
                          border: "none",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "10px",
                        }}
                      >
                        Use
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Active Debilities Display */}
            {character.debilities.length > 0 && (
              <div
                style={{
                  marginTop: "15px",
                  paddingTop: "10px",
                  borderTop: "1px solid rgba(0, 255, 136, 0.3)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#ef4444",
                    marginBottom: "5px",
                  }}
                >
                  Active Debilities:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {character.debilities.map((debility) => (
                    <span
                      key={debility}
                      style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid #ef4444",
                        color: "#fca5a5",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {debilityTypes[debility].icon}{" "}
                      {debilityTypes[debility].name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Session Notes Panel */}
          <div
            style={{
              ...panelStyle,
              gridColumn: compactMode ? "auto" : "1 / -1",
            }}
          >
            <h3
              style={{
                color: "#00ff88",
                marginBottom: "15px",
                fontSize: "1.3rem",
              }}
            >
              📝 Session Notes
            </h3>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Track important events, NPCs, plot threads, and campaign notes here..."
              style={{
                width: "100%",
                height: "120px",
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(0, 255, 136, 0.3)",
                borderRadius: "6px",
                color: "#e0e0e0",
                padding: "10px",
                resize: "vertical",
                fontFamily: "inherit",
                fontSize: "0.9rem",
              }}
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  const timestamp = new Date().toLocaleString();
                  setSessionNotes(
                    (prev) =>
                      prev + (prev ? "\n\n" : "") + `--- ${timestamp} ---\n`,
                  );
                }}
                style={buttonStyle}
              >
                📅 Timestamp
              </button>
              <button
                onClick={() => {
                  if (confirm("Clear all notes?")) {
                    setSessionNotes("");
                  }
                }}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #ef4444, #dc2626)",
                }}
              >
                🗑️ Clear
              </button>
              <button
                onClick={() => setCompactMode(!compactMode)}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(45deg, #6366f1, #4f46e5)",
                }}
              >
                {compactMode ? "🖥️" : "📱"} {compactMode ? "Expand" : "Compact"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Roll Result Modal */}
      {showRollModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(5px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              border: "2px solid #00ff88",
              borderRadius: "15px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 0 30px rgba(0, 255, 136, 0.5)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "linear-gradient(45deg, #0f3460, #533483)",
                borderRadius: "13px 13px 0 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "1.5rem", color: "#00ff88", margin: 0 }}>
                  🎲 Roll Result
                </h2>
                <button
                  onClick={() => setShowRollModal(false)}
                  style={{
                    background: "rgba(239, 68, 68, 0.8)",
                    border: "2px solid #ef4444",
                    color: "white",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "8px",
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            <div style={{ padding: "30px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#00ff88",
                  marginBottom: "15px",
                }}
              >
                {rollModalData.result}
              </div>
              {rollModalData.description && (
                <div style={{ color: "#e0e0e0", marginBottom: "15px" }}>
                  {rollModalData.description}
                </div>
              )}
              {rollModalData.context && (
                <div
                  style={{
                    color: "#aaa",
                    fontSize: "0.9rem",
                    marginBottom: "20px",
                  }}
                >
                  {rollModalData.context}
                </div>
              )}
              <button
                onClick={() => setShowRollModal(false)}
                style={buttonStyle}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showLevelUpModal && (
        <LevelUpModal
          character={character}
          setCharacter={setCharacter}
          levelUpState={levelUpState}
          setLevelUpState={setLevelUpState}
          onClose={() => setShowLevelUpModal(false)}
          rollDie={rollDie}
          setRollResult={setRollResult}
        />
      )}

      {/* Other Modal Placeholders */}
      {showStatusModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              border: "2px solid #00ff88",
              borderRadius: "15px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#00ff88" }}>💀 Status Effects & Debilities</h2>
            <p style={{ color: "#aaa", margin: "20px 0" }}>
              Component coming soon...
            </p>
            <button
              onClick={() => setShowStatusModal(false)}
              style={buttonStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDamageModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              border: "2px solid #00ff88",
              borderRadius: "15px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#00ff88" }}>💔 Damage Calculator</h2>
            <p style={{ color: "#aaa", margin: "20px 0" }}>
              Component coming soon...
            </p>
            <button
              onClick={() => setShowDamageModal(false)}
              style={buttonStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showInventoryModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              border: "2px solid #00ff88",
              borderRadius: "15px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#00ff88" }}>🎒 Inventory Management</h2>
            <p style={{ color: "#aaa", margin: "20px 0" }}>
              Component coming soon...
            </p>
            <button
              onClick={() => setShowInventoryModal(false)}
              style={buttonStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showBondsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              border: "2px solid #00ff88",
              borderRadius: "15px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#00ff88" }}>👥 Character Bonds</h2>
            <p style={{ color: "#aaa", margin: "20px 0" }}>
              Component coming soon...
            </p>
            <button
              onClick={() => setShowBondsModal(false)}
              style={buttonStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
