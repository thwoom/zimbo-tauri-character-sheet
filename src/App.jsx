import React, { useState, useEffect } from 'react';
import './App.css';
import BondsModal from './components/BondsModal.jsx';
import CharacterStats from './components/CharacterStats.jsx';
import DamageModal from './components/DamageModal.jsx';
import InventoryModal from './components/InventoryModal.jsx';
import InventoryPanel from './components/InventoryPanel.jsx';
import LevelUpModal from './components/LevelUpModal.jsx';
import RollModal from './components/RollModal.jsx';
import SessionNotes from './components/SessionNotes.jsx';
import StatusModal from './components/StatusModal.jsx';
import { panelStyle, buttonStyle } from './components/styles.js';
import useModal from './hooks/useModal';
import { statusEffectTypes, debilityTypes } from './state/character';
import { useCharacter } from './state/CharacterContext.jsx';

function App() {
  const { character, setCharacter } = useCharacter();

  // UI State Management
  const [rollResult, setRollResult] = useState('Ready to roll!');
  const rollModal = useModal();
  const bondsModal = useModal();
  const [rollModalData, setRollModalData] = useState({});
  const [rollHistory, setRollHistory] = useState([]);
  const [sessionNotes, setSessionNotes] = useState('');

  // Modal States
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  
  // Additional UI State
  const [compactMode, setCompactMode] = useState(false);
  const [autoXpOnMiss, setAutoXpOnMiss] = useState(true);

  // Level Up State
  const [levelUpState, setLevelUpState] = useState({
    selectedStats: [],
    selectedMove: '',
    hpIncrease: 0,
    newLevel: character.level + 1,
    expandedMove: ''
  });

  // Auto-detect level up opportunity
  useEffect(() => {
    if (character.xp >= character.xpNeeded && !showLevelUpModal) {
      setShowLevelUpModal(true);
      setLevelUpState(prev => ({ ...prev, newLevel: character.level + 1 }));
    }
  }, [character.xp, character.xpNeeded, character.level, showLevelUpModal]);

  // Utility Functions
  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

  const getTotalArmor = () => {
    const baseArmor = character.armor || 0;
    const equippedArmor = character.inventory
      .filter(item => item.equipped && item.armor)
      .reduce((total, item) => total + (item.armor || 0), 0);
    return baseArmor + equippedArmor;
  };

  const getEquippedWeaponDamage = () => {
    const weapon = character.inventory.find(item => item.equipped && item.type === 'weapon');
    return weapon ? weapon.damage || 'd6' : 'd6';
  };

  // Get status effect modifiers
  const getStatusModifiers = (rollType = 'general') => {
    let modifier = 0;
    let notes = [];
    
    if (character.statusEffects.includes('poisoned')) {
      modifier -= 1;
      notes.push('Poisoned (-1)');
    }
    if (character.statusEffects.includes('shocked') && rollType === 'dex') {
      modifier -= 2;
      notes.push('Shocked (-2 DEX)');
    }
    if (character.statusEffects.includes('weakened') && rollType === 'damage') {
      modifier -= 1;
      notes.push('Weakened (-1 damage)');
    }
    if (character.statusEffects.includes('frozen') && (rollType === 'str' || rollType === 'dex')) {
      modifier -= 1;
      notes.push('Frozen (-1 physical)');
    }
    if (character.statusEffects.includes('blessed')) {
      modifier += 1;
      notes.push('Blessed (+1)');
    }
    
    // Add debility modifiers
    character.debilities.forEach(debility => {
      if ((debility === 'weak' && rollType === 'str') ||
          (debility === 'shaky' && rollType === 'dex') ||
          (debility === 'sick' && rollType === 'con') ||
          (debility === 'stunned' && rollType === 'int') ||
          (debility === 'confused' && rollType === 'wis') ||
          (debility === 'scarred' && rollType === 'cha')) {
        modifier -= 1;
        notes.push(`${debilityTypes[debility].name} (-1)`);
      }
    });
    
    return { modifier, notes };
  };

  // Core Dice Rolling System
  const rollDice = (formula, description = '') => {
    let result = '';
    let total = 0;
    let interpretation = '';
    let context = '';

    if (formula.includes('2d6')) {
      const die1 = rollDie(6);
      const die2 = rollDie(6);
      const baseModifier = parseInt(formula.replace('2d6', '').replace('+', '') || '0');
      
      // Determine roll type for status effects
      let rollType = 'general';
      if (description.includes('STR') || description.includes('Hack')) rollType = 'str';
      else if (description.includes('DEX')) rollType = 'dex';
      else if (description.includes('CON')) rollType = 'con';
      else if (description.includes('INT')) rollType = 'int';
      else if (description.includes('WIS')) rollType = 'wis';
      else if (description.includes('CHA')) rollType = 'cha';
      else if (description.includes('damage') || description.includes('Damage') || description.includes('Upper Hand') || description.includes('Bonus Damage')) rollType = 'damage';
      
      const statusMods = getStatusModifiers(rollType);
      const totalModifier = baseModifier + statusMods.modifier;
      total = die1 + die2 + totalModifier;
      
      result = `2d6: [${die1}, ${die2}]`;
      if (baseModifier !== 0) {
        result += ` ${baseModifier >= 0 ? '+' : ''}${baseModifier}`;
      }
      if (statusMods.modifier !== 0) {
        result += ` ${statusMods.modifier >= 0 ? '+' : ''}${statusMods.modifier}`;
      }
      result += ` = ${total}`;

      if (statusMods.notes.length > 0) {
        result += ` (${statusMods.notes.join(', ')})`;
      }

      // Dungeon World success thresholds
      if (total >= 10) {
        interpretation = ' ✅ Success!';
        context = getSuccessContext(description);
      } else if (total >= 7) {
        interpretation = ' ⚠️ Partial Success';
        context = getPartialContext(description);
      } else {
        interpretation = ' ❌ Failure';
        context = getFailureContext(description);
        if (autoXpOnMiss) {
          setCharacter(prev => ({ ...prev, xp: prev.xp + 1 }));
        }
      }
    } else if (formula.startsWith('d')) {
      const sides = parseInt(formula.replace('d', '').split('+')[0]);
      const baseModifier = parseInt(formula.split('+')[1] || '0');
      const roll = rollDie(sides);
      
      const rollType = description.includes('damage') || description.includes('Damage') ? 'damage' : 'general';
      const statusMods = getStatusModifiers(rollType);
      const totalModifier = baseModifier + statusMods.modifier;
      total = roll + totalModifier;
      
      result = `d${sides}: ${roll}`;
      if (baseModifier !== 0) {
        result += ` +${baseModifier}`;
      }
      if (statusMods.modifier !== 0) {
        result += ` ${statusMods.modifier >= 0 ? '+' : ''}${statusMods.modifier}`;
      }
      result += ` = ${total}`;

      if (statusMods.notes.length > 0) {
        result += ` (${statusMods.notes.join(', ')})`;
      }
    }

    const rollData = {
      result: result + interpretation,
      description,
      context,
      total,
      timestamp: new Date().toLocaleTimeString()
    };

    // Add to roll history (keep last 10)
      setRollHistory(prev => [rollData, ...prev.slice(0, 9)]);
      setRollModalData(rollData);
      rollModal.open();
  };

  // Context helpers for roll results
  const getSuccessContext = (description) => {
    if (description.includes('STR')) return "Power through with overwhelming force!";
    if (description.includes('DEX')) return "Graceful and precise execution!";
    if (description.includes('CON')) return "Tough as cybernetic nails!";
    if (description.includes('INT')) return "Brilliant tactical insight!";
    if (description.includes('WIS')) return "Crystal clear perception!";
    if (description.includes('CHA')) return "Surprisingly charming for a cyber-barbarian!";
    if (description.includes('Hack')) return "Clean hit, enemy can't counter!";
    if (description.includes('Taunt')) return "They're completely focused on you now!";
    return "Perfect execution!";
  };

  const getPartialContext = (description) => {
    if (description.includes('STR')) return "Success, but strain yourself or equipment";
    if (description.includes('DEX')) return "Stumble slightly, awkward position";
    if (description.includes('CON')) return "Feel the strain, maybe take harm";
    if (description.includes('INT')) return "Confusing situation, partial info";
    if (description.includes('WIS')) return "Something seems off, can't quite tell what";
    if (description.includes('CHA')) return "Awkward interaction, mixed signals";
    if (description.includes('Hack')) return "Hit them, but they hit you back!";
    if (description.includes('Taunt')) return "They attack you but with +1 ongoing damage!";
    return "Success with complications";
  };

  const getFailureContext = (description) => {
    if (description.includes('STR')) return "Too heavy, equipment fails, or overpower backfires";
    if (description.includes('DEX')) return "Trip, fumble, or end up in worse position";
    if (description.includes('CON')) return "Exhausted, hurt, or overcome by conditions";
    if (description.includes('INT')) return "No clue, wrong conclusion, or miss key detail";
    if (description.includes('WIS')) return "Completely missed the signs";
    if (description.includes('CHA')) return "Offensive, rude, or make things worse";
    if (description.includes('Hack')) return "Miss entirely, terrible position";
    if (description.includes('Taunt')) return "They ignore you completely";
    return "Things go badly";
  };

  // Undo System
  const saveToHistory = (action) => {
    setCharacter(prev => ({
      ...prev,
      actionHistory: [
        { action, state: prev, timestamp: Date.now() },
        ...prev.actionHistory.slice(0, 4) // Keep last 5 actions
      ]
    }));
  };

  const undoLastAction = () => {
    if (character.actionHistory.length > 0) {
      const lastAction = character.actionHistory[0];
      setCharacter(lastAction.state);
      setRollResult(`↶ Undid: ${lastAction.action}`);
      setTimeout(() => setRollResult('Ready to roll!'), 2000);
    }
  };

  // Visual effects based on status
  const getActiveVisualEffects = () => {
    if (character.statusEffects.includes('poisoned')) return 'poisoned-overlay';
    if (character.statusEffects.includes('burning')) return 'burning-overlay';
    if (character.statusEffects.includes('shocked')) return 'shocked-overlay';
    if (character.statusEffects.includes('frozen')) return 'frozen-overlay';
    if (character.statusEffects.includes('blessed')) return 'blessed-overlay';
    return '';
  };

  const handleEquipItem = (id) => {
    setCharacter(prev => ({
      ...prev,
      inventory: prev.inventory.map(item =>
        item.id === id ? { ...item, equipped: !item.equipped } : item
      )
    }));
  };

  const handleConsumeItem = (id) => {
    setCharacter(prev => ({
      ...prev,
      inventory: prev.inventory.reduce((acc, item) => {
        if (item.id === id) {
          if (item.quantity && item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    }));
  };

  const handleDropItem = (id) => {
    setCharacter(prev => ({
      ...prev,
      inventory: prev.inventory.filter(item => item.id !== id)
    }));
  };

  const handleToggleStatusEffect = (effect) => {
    setCharacter(prev => ({
      ...prev,
      statusEffects: prev.statusEffects.includes(effect)
        ? prev.statusEffects.filter(e => e !== effect)
        : [...prev.statusEffects, effect]
    }));
  };

  const handleToggleDebility = (debility) => {
    setCharacter(prev => ({
      ...prev,
      debilities: prev.debilities.includes(debility)
        ? prev.debilities.filter(d => d !== debility)
        : [...prev.debilities, debility]
    }));
  };

  const getHeaderColor = () => {
    if (character.statusEffects.includes('poisoned')) return 'linear-gradient(45deg, #22c55e, #059669, #00d4aa)';
    if (character.statusEffects.includes('burning')) return 'linear-gradient(45deg, #ef4444, #f97316, #fbbf24)';
    if (character.statusEffects.includes('shocked')) return 'linear-gradient(45deg, #3b82f6, #eab308, #00d4aa)';
    if (character.statusEffects.includes('frozen')) return 'linear-gradient(45deg, #06b6d4, #3b82f6, #6366f1)';
    if (character.statusEffects.includes('blessed')) return 'linear-gradient(45deg, #fbbf24, #f59e0b, #00d4aa)';
    return 'linear-gradient(45deg, #6366f1, #8b5cf6, #00d4aa)'; // default
  };

  // Styles using inline styles for Tauri compatibility
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: '#e0e0e0',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: getHeaderColor(),
    borderRadius: '15px',
    border: '2px solid #00ff88',
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
    transition: 'all 0.5s ease'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  };

  // Styles moved to shared style objects

  return (
    <div style={containerStyle} className={getActiveVisualEffects()}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', textShadow: '0 0 10px #00ff88' }}>
                🧾 ZIMBO – The Time-Bound Juggernaut
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p>Barbarian-Wizard Hybrid | Level {character.level} | Neutral Good</p>
                {character.statusEffects.length > 0 && (
                  <div style={{ display: 'flex', gap: '5px', padding: '5px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px' }}>
                    {character.statusEffects.map(effect => (
                      <span
                        key={effect}
                        title={statusEffectTypes[effect]?.name}
                        style={{ fontSize: '18px', animation: 'pulse 2s infinite' }}
                      >
                        {statusEffectTypes[effect]?.icon}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={undoLastAction}
                disabled={character.actionHistory.length === 0}
                style={{
                  ...buttonStyle,
                  background: character.actionHistory.length > 0 
                    ? 'linear-gradient(45deg, #6b7280, #4b5563)' 
                    : 'linear-gradient(45deg, #374151, #6b7280)',
                  opacity: character.actionHistory.length > 0 ? 1 : 0.5,
                  cursor: character.actionHistory.length > 0 ? 'pointer' : 'not-allowed'
                }}
                title="Undo last action"
              >
                ↶ Undo
              </button>
              <button
                onClick={() => setShowDamageModal(true)}
                style={{ ...buttonStyle, background: 'linear-gradient(45deg, #ef4444, #dc2626)' }}
              >
                💔 Take Damage
              </button>
              <button
                onClick={() => setShowStatusModal(true)}
                style={{ ...buttonStyle, background: 'linear-gradient(45deg, #f97316, #ea580c)' }}
              >
                💀 Effects ({character.statusEffects.length + character.debilities.length})
              </button>
              <button
                onClick={() => setShowInventoryModal(true)}
                style={{ ...buttonStyle, background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)' }}
              >
                🎒 Inventory
              </button>
                <button
                  onClick={bondsModal.open}
                  style={{ ...buttonStyle, background: 'linear-gradient(45deg, #3b82f6, #2563eb)' }}
                >
                  👥 Bonds ({character.bonds.filter(b => !b.resolved).length})
                </button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div style={gridStyle}>
          {/* Stats Panel */}
          <CharacterStats
            character={character}
            setCharacter={setCharacter}
            saveToHistory={saveToHistory}
            getTotalArmor={getTotalArmor}
            setShowLevelUpModal={setShowLevelUpModal}
            autoXpOnMiss={autoXpOnMiss}
            setAutoXpOnMiss={setAutoXpOnMiss}
            setRollResult={setRollResult}
          />

          {/* Dice Roller Panel */}
          <div style={panelStyle}>
            <h3 style={{ color: '#00ff88', marginBottom: '15px', fontSize: '1.3rem' }}>🎲 Dice Roller</h3>
            
            {/* Stat Check Buttons */}
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1rem' }}>Stat Checks</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                {Object.entries(character.stats).map(([stat, data]) => (
                  <button
                    key={stat}
                    onClick={() => rollDice(`2d6+${data.mod}`, `${stat} Check`)}
                    style={{
                      ...buttonStyle,
                      background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                      padding: '8px 6px',
                      margin: '2px',
                      fontSize: '11px'
                    }}
                  >
                    {stat} ({data.mod >= 0 ? '+' : ''}{data.mod})
                  </button>
                ))}
              </div>
            </div>

            {/* Combat Rolls */}
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1rem' }}>Combat Rolls</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
                <button
                  onClick={() => rollDice(getEquippedWeaponDamage(), 'Weapon Damage')}
                  style={{ ...buttonStyle, background: 'linear-gradient(45deg, #ef4444, #dc2626)', margin: '2px', fontSize: '11px' }}
                >
                  Weapon ({getEquippedWeaponDamage()})
                </button>
                <button
                  onClick={() => rollDice('2d6+3', 'Hack & Slash')}
                  style={{ ...buttonStyle, background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)', margin: '2px', fontSize: '11px' }}
                >
                  Hack & Slash
                </button>
                <button
                  onClick={() => rollDice('d4', 'Upper Hand')}
                  style={{ ...buttonStyle, background: 'linear-gradient(45deg, #f97316, #ea580c)', margin: '2px', fontSize: '11px' }}
                >
                  Upper Hand d4
                </button>
                <button
                  onClick={() => rollDice('2d6-1', 'Taunt')}
                  style={{ ...buttonStyle, background: 'linear-gradient(45deg, #eab308, #d97706)', margin: '2px', fontSize: '11px' }}
                >
                  Taunt Enemy
                </button>
              </div>
            </div>

            {/* Basic Dice */}
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1rem' }}>Basic Dice</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
                {[4, 6, 8, 10, 12, 20].map(sides => (
                  <button
                    key={sides}
                    onClick={() => rollDice(`d${sides}`)}
                    style={{
                      ...buttonStyle,
                      background: 'linear-gradient(45deg, #06b6d4, #0891b2)',
                      padding: '8px 4px',
                      margin: '2px',
                      fontSize: '11px'
                    }}
                  >
                    d{sides}
                  </button>
                ))}
              </div>
            </div>

            {/* Roll Result Display */}
            <div style={{
              background: 'rgba(0, 255, 136, 0.2)',
              padding: '10px',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: 'bold',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {rollResult}
            </div>

            {/* Roll History */}
            {rollHistory.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                <div style={{ color: '#00ff88', marginBottom: '5px' }}>Recent Rolls:</div>
                {rollHistory.slice(0, 3).map((roll, index) => (
                  <div key={index} style={{ color: '#aaa', marginBottom: '2px' }}>
                    <span style={{ color: '#00ff88' }}>{roll.timestamp}</span> - {roll.result}
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Quick Inventory Panel */}
            <InventoryPanel
              character={character}
              setCharacter={setCharacter}
              rollDie={rollDie}
              setRollResult={setRollResult}
            />

            {/* Session Notes Panel */}

            <SessionNotes
              sessionNotes={sessionNotes}
              setSessionNotes={setSessionNotes}
              compactMode={compactMode}
              setCompactMode={setCompactMode}
            />
        </div>
      </div>

        <RollModal isOpen={rollModal.isOpen} data={rollModalData} onClose={rollModal.close} />

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

      {showStatusModal && (
        <StatusModal
          statusEffects={character.statusEffects}
          debilities={character.debilities}
          statusEffectTypes={statusEffectTypes}
          debilityTypes={debilityTypes}
          onToggleStatusEffect={handleToggleStatusEffect}
          onToggleDebility={handleToggleDebility}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      <DamageModal isOpen={showDamageModal} onClose={() => setShowDamageModal(false)} />

      {showInventoryModal && (
        <InventoryModal
          inventory={character.inventory}
          onEquip={handleEquipItem}
          onConsume={handleConsumeItem}
          onDrop={handleDropItem}
          onClose={() => setShowInventoryModal(false)}
        />
      )}

        <BondsModal isOpen={bondsModal.isOpen} onClose={bondsModal.close} />
    </div>
  );
}

export default App;