import React, { useState, useEffect } from 'react';
import './App.css';
import LevelUpModal from './components/LevelUpModal';
import InventoryModal from './components/InventoryModal';
import StatusModal from './components/StatusModal';
import RollModal from './components/RollModal';
import BondsModal from './components/BondsModal';
import StatsPanel from './components/StatsPanel';
import MoveList from './components/MoveList';
import SessionNotes from './components/SessionNotes';
import { useCharacter } from './state/CharacterContext';
import { statusEffectTypes, debilityTypes } from './state/character';
import useModal from './hooks/useModal';

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
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Additional UI State
  const [damageInput, setDamageInput] = useState('');
  const [compactMode, setCompactMode] = useState(false);

  // Level Up State
  const [levelUpState, setLevelUpState] = useState({
    selectedStats: [],
    selectedMove: '',
    hpIncrease: 0,
    newLevel: 5,
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

  const panelStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(0, 255, 136, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    padding: '8px 15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    margin: '5px'
  };

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
          <StatsPanel
            character={character}
            setCharacter={setCharacter}
            saveToHistory={saveToHistory}
            getTotalArmor={getTotalArmor}
            setShowLevelUpModal={setShowLevelUpModal}
          />

          {/* Resources Panel */}
          <div style={panelStyle}>
            <h3 style={{ color: '#00ff88', marginBottom: '15px', fontSize: '1.3rem' }}>🔋 Resources</h3>
            
            {/* Chrono-Retcon */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>Chrono-Retcon Uses:</span>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{character.resources.chronoUses}/2</span>
              </div>
              <button
                onClick={() => {
                  if (character.resources.chronoUses > 0) {
                    setCharacter(prev => ({ 
                      ...prev, 
                      resources: { ...prev.resources, chronoUses: prev.resources.chronoUses - 1 }
                    }));
                    setRollResult('⏰ Chrono-Retcon activated - rewrite any recent action!');
                    setTimeout(() => setRollResult('Ready to roll!'), 3000);
                  } else {
                    setRollResult('❌ No uses remaining!');
                    setTimeout(() => setRollResult('Ready to roll!'), 2000);
                  }
                }}
                disabled={character.resources.chronoUses === 0}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  background: character.resources.chronoUses > 0 
                    ? 'linear-gradient(45deg, #10b981, #059669)' 
                    : 'linear-gradient(45deg, #6b7280, #374151)',
                  opacity: character.resources.chronoUses > 0 ? 1 : 0.5,
                  cursor: character.resources.chronoUses > 0 ? 'pointer' : 'not-allowed'
                }}
                title="Rewrite any recent action retroactively. Examples: 'Actually, I dodged that attack' or 'I already searched this room'"
              >
                ⏰ Use Chrono-Retcon
              </button>
            </div>

            {/* Other Resources */}
            {[
              { key: 'paradoxPoints', label: 'Paradox Points', max: 3, color: '#fbbf24' },
              { key: 'bandages', label: 'Bandages', max: 3, color: '#8b5cf6' },
              { key: 'rations', label: 'Rations', max: 5, color: '#f97316' },
              { key: 'advGear', label: 'Adventuring Gear', max: 5, color: '#06b6d4' }
            ].map(({ key, label, max, color }) => (
              <div key={key} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{label}:</span>
                  <span style={{ color, fontWeight: 'bold' }}>{character.resources[key]}/{max}</span>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => setCharacter(prev => ({ 
                      ...prev, 
                      resources: { ...prev.resources, [key]: Math.max(0, prev.resources[key] - 1) }
                    }))}
                    style={{
                      ...buttonStyle,
                      background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                      padding: '5px 10px',
                      margin: '0',
                      fontSize: '12px',
                      flex: '1'
                    }}
                  >
                    -1
                  </button>
                  <button
                    onClick={() => setCharacter(prev => ({ 
                      ...prev, 
                      resources: { ...prev.resources, [key]: Math.min(max, prev.resources[key] + 1) }
                    }))}
                    style={{
                      ...buttonStyle,
                      padding: '5px 10px',
                      margin: '0',
                      fontSize: '12px',
                      flex: '1'
                    }}
                  >
                    +1
                  </button>
                </div>
              </div>
            ))}

            {/* Paradox Warning */}
            {character.resources.paradoxPoints >= 3 && (
              <div style={{
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid #fbbf24',
                borderRadius: '6px',
                padding: '10px',
                textAlign: 'center',
                marginTop: '10px'
              }}>
                <div style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  ⚠️ REALITY UNSTABLE! ⚠️
                </div>
              </div>
            )}

            {/* Reset All Button */}
            <button
              onClick={() => {
                setCharacter(prev => ({
                  ...prev,
                  resources: { chronoUses: 2, paradoxPoints: 0, bandages: 3, rations: 5, advGear: 5 }
                }));
                setRollResult('🔄 All resources restored!');
              }}
              style={{
                ...buttonStyle,
                width: '100%',
                marginTop: '15px',
                background: 'linear-gradient(45deg, #4a90ff, #00ff88)',
                padding: '10px 20px'
              }}
            >
              🔄 Reset All Resources
            </button>
          </div>

          <MoveList
            character={character}
            rollDice={rollDice}
            getEquippedWeaponDamage={getEquippedWeaponDamage}
            rollResult={rollResult}
            rollHistory={rollHistory}
          />

          {/* Quick Inventory Panel */}
          <div style={panelStyle}>
            <h3 style={{ color: '#00ff88', marginBottom: '15px', fontSize: '1.3rem' }}>🎒 Equipment</h3>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {character.inventory.slice(0, 5).map(item => (
                <div key={item.id} style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '8px 12px',
                  margin: '5px 0',
                  borderRadius: '6px',
                  borderLeft: item.equipped ? '3px solid #10b981' : '3px solid #00ff88'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {item.type === 'weapon' && '⚔️'}
                        {item.type === 'magic' && '💍'}
                        {item.type === 'consumable' && '🧪'}
                        {item.type === 'armor' && '🛡️'}
                        {item.type === 'material' && '📦'}
                        {(!item.type || item.type === 'gear') && '🎒'}
                        {item.name}
                        {item.equipped && <span style={{ color: '#10b981', fontSize: '0.7rem' }}>✓</span>}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#aaa' }}>
                        {item.damage && `${item.damage} damage`}
                        {item.armor && `+${item.armor} armor`}
                        {item.quantity > 1 && ` x${item.quantity}`}
                      </div>
                    </div>
                    {item.type === 'consumable' && item.quantity > 0 && (
                      <button
                        onClick={() => {
                          if (item.name === 'Healing Potion') {
                            const healing = rollDie(8);
                            const newHP = Math.min(character.maxHp, character.hp + healing);
                            setCharacter(prev => ({
                              ...prev,
                              hp: newHP,
                              inventory: prev.inventory.map(invItem => 
                                invItem.id === item.id 
                                  ? { ...invItem, quantity: invItem.quantity - 1 }
                                  : invItem
                              ).filter(invItem => invItem.type !== 'consumable' || invItem.quantity > 0)
                            }));
                            setRollResult(`Used ${item.name}: healed ${healing} HP!`);
                          }
                        }}
                        style={{
                          background: 'linear-gradient(45deg, #10b981, #059669)',
                          border: 'none',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px'
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
              <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(0, 255, 136, 0.3)' }}>
                <div style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '5px' }}>Active Debilities:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {character.debilities.map(debility => (
                    <span key={debility} style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      color: '#fca5a5',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem'
                    }}>
                      {debilityTypes[debility].icon} {debilityTypes[debility].name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

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

      {showDamageModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#1a1a2e',
            border: '2px solid #00ff88',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#00ff88' }}>💔 Damage Calculator</h2>
            <p style={{ color: '#aaa', margin: '20px 0' }}>Component coming soon...</p>
            <button onClick={() => setShowDamageModal(false)} style={buttonStyle}>Close</button>
          </div>
        </div>
      )}

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