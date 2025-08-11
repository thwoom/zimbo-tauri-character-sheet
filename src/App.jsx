import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CharacterStats from './components/CharacterStats.jsx';
import DiceRoller from './components/DiceRoller.jsx';
import GameModals from './components/GameModals.jsx';
import InventoryPanel from './components/InventoryPanel.jsx';
import SessionNotes from './components/SessionNotes.jsx';
import { buttonStyle } from './components/styles.js';
import useDiceRoller from './hooks/useDiceRoller';
import useInventory from './hooks/useInventory';
import useModal from './hooks/useModal';
import { statusEffectTypes, debilityTypes } from './state/character';
import { useCharacter } from './state/CharacterContext.jsx';

function App() {
  const { character, setCharacter } = useCharacter();

  // UI State
  const bondsModal = useModal();
  const [sessionNotes, setSessionNotes] = useState(
    () => localStorage.getItem('sessionNotes') ?? 'My session note',
  );
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [autoXpOnMiss, setAutoXpOnMiss] = useState(true);

  const {
    rollResult,
    setRollResult,
    rollHistory,
    rollDice,
    rollModal,
    rollModalData,
    rollDie,
    clearRollHistory,
  } = useDiceRoller(character, setCharacter, autoXpOnMiss);

  const {
    getTotalArmor,
    getEquippedWeaponDamage,
    handleEquipItem,
    handleConsumeItem,
    handleDropItem,
  } = useInventory(character, setCharacter);

  // Auto-detect level up opportunity
  useEffect(() => {
    if (character.xp >= character.xpNeeded && !showLevelUpModal) {
      setShowLevelUpModal(true);
      // ensure next level reflects current character.level
      // (avoids stale closure if character.level changed)
    }
  }, [character.xp, character.xpNeeded, character.level, showLevelUpModal]);

  // Persist session notes
  useEffect(() => {
    if (sessionNotes) {
      localStorage.setItem('sessionNotes', sessionNotes);
    } else {
      localStorage.removeItem('sessionNotes');
    }
  }, [sessionNotes]);

  // Undo System
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const saveToHistory = (action) => {
    setCharacter((prev) => ({
      ...prev,
      actionHistory: [
        { action, state: prev, timestamp: Date.now() },
        ...prev.actionHistory.slice(0, 4),
      ],
    }));
  };

  const undoLastAction = () => {
    if (character.actionHistory.length > 0) {
      const lastAction = character.actionHistory[0];
      setCharacter(lastAction.state);
      setRollResult(`↶ Undid: ${lastAction.action}`);
      timeoutRef.current = setTimeout(() => setRollResult('Ready to roll!'), 2000);
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

  const handleToggleStatusEffect = (effect) => {
    setCharacter((prev) => ({
      ...prev,
      statusEffects: prev.statusEffects.includes(effect)
        ? prev.statusEffects.filter((e) => e !== effect)
        : [...prev.statusEffects, effect],
    }));
  };

  const handleToggleDebility = (debility) => {
    setCharacter((prev) => ({
      ...prev,
      debilities: prev.debilities.includes(debility)
        ? prev.debilities.filter((d) => d !== debility)
        : [...prev.debilities, debility],
    }));
  };

  const getHeaderColor = () => {
    if (character.statusEffects.includes('poisoned'))
      return 'linear-gradient(45deg, #22c55e, #059669, #00d4aa)';
    if (character.statusEffects.includes('burning'))
      return 'linear-gradient(45deg, #ef4444, #f97316, #fbbf24)';
    if (character.statusEffects.includes('shocked'))
      return 'linear-gradient(45deg, #3b82f6, #eab308, #00d4aa)';
    if (character.statusEffects.includes('frozen'))
      return 'linear-gradient(45deg, #06b6d4, #3b82f6, #6366f1)';
    if (character.statusEffects.includes('blessed'))
      return 'linear-gradient(45deg, #fbbf24, #f59e0b, #00d4aa)';
    return 'linear-gradient(45deg, #6366f1, #8b5cf6, #00d4aa)';
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: '#e0e0e0',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: getHeaderColor(),
    borderRadius: '15px',
    border: '2px solid #00ff88',
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
    transition: 'all 0.5s ease',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle} className={getActiveVisualEffects()}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1
                style={{ fontSize: '2.5rem', marginBottom: '10px', textShadow: '0 0 10px #00ff88' }}
              >
                🧾 ZIMBO – The Time-Bound Juggernaut
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p>Barbarian-Wizard Hybrid | Level {character.level} | Neutral Good</p>
                {character.statusEffects.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '5px',
                      padding: '5px 10px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '20px',
                    }}
                  >
                    {character.statusEffects.map((effect) => (
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
                  background:
                    character.actionHistory.length > 0
                      ? 'linear-gradient(45deg, #6b7280, #4b5563)'
                      : 'linear-gradient(45deg, #374151, #6b7280)',
                  opacity: character.actionHistory.length > 0 ? 1 : 0.5,
                  cursor: character.actionHistory.length > 0 ? 'pointer' : 'not-allowed',
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
                👥 Bonds ({character.bonds.filter((b) => !b.resolved).length})
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
            setSessionNotes={setSessionNotes}
            clearRollHistory={clearRollHistory}
          />

          {/* Dice Roller Panel (component-based, main branch design) */}
          <DiceRoller
            character={character}
            rollDice={rollDice}
            rollResult={rollResult}
            rollHistory={rollHistory}
            getEquippedWeaponDamage={getEquippedWeaponDamage}
            rollModal={rollModal}
            rollModalData={rollModalData}
          />

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

      <GameModals
        character={character}
        setCharacter={setCharacter}
        levelUpState={{
          selectedStats: [],
          selectedMove: '',
          hpIncrease: 0,
          newLevel: character.level + 1,
          expandedMove: '',
        }}
        setLevelUpState={() => {}}
        showLevelUpModal={showLevelUpModal}
        setShowLevelUpModal={setShowLevelUpModal}
        rollDie={rollDie}
        setRollResult={setRollResult}
        showStatusModal={showStatusModal}
        setShowStatusModal={setShowStatusModal}
        statusEffectTypes={statusEffectTypes}
        debilityTypes={debilityTypes}
        handleToggleStatusEffect={handleToggleStatusEffect}
        handleToggleDebility={handleToggleDebility}
        showDamageModal={showDamageModal}
        setShowDamageModal={setShowDamageModal}
        showInventoryModal={showInventoryModal}
        setShowInventoryModal={setShowInventoryModal}
        inventory={character.inventory}
        handleEquipItem={handleEquipItem}
        handleConsumeItem={handleConsumeItem}
        handleDropItem={handleDropItem}
        bondsModal={bondsModal}
      />
    </div>
  );
}

export default App;
