import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CharacterStats from './components/CharacterStats.jsx';
import DiceRoller from './components/DiceRoller.jsx';
import GameModals from './components/GameModals.jsx';
import InventoryPanel from './components/InventoryPanel.jsx';
import SessionNotes from './components/SessionNotes.jsx';
import useDiceRoller from './hooks/useDiceRoller';
import useInventory from './hooks/useInventory';
import useModal from './hooks/useModal.js';
import { statusEffectTypes, debilityTypes } from './state/character';
import { useCharacter } from './state/CharacterContext.jsx';
import styles from './styles/AppStyles.module.css';

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

  const { totalArmor, equippedWeaponDamage, handleEquipItem, handleConsumeItem, handleDropItem } =
    useInventory(character, setCharacter);

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
        { action, state: structuredClone(prev), timestamp: Date.now() },
        ...prev.actionHistory.slice(0, 4),
      ],
    }));
  };

  const undoLastAction = () => {
    if (character.actionHistory.length > 0) {
      const lastAction = character.actionHistory[0];
      setCharacter(structuredClone(lastAction.state));
      setRollResult(`↶ Undid: ${lastAction.action}`);
      timeoutRef.current = setTimeout(() => setRollResult('Ready to roll!'), 2000);
    }
  };

  // Visual effects based on status
  const statusEffectClassMap = {
    poisoned: 'poisoned-overlay',
    burning: 'burning-overlay',
    shocked: 'shocked-overlay',
    frozen: 'frozen-overlay',
    blessed: 'blessed-overlay',
  };

  const getActiveVisualEffects = () => {
    for (const [effect, cssClass] of Object.entries(statusEffectClassMap)) {
      if (character.statusEffects.includes(effect)) {
        return cssClass;
      }
    }
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

  // Styles moved to CSS modules

  return (
    <div className={`${styles.container} ${getActiveVisualEffects()}`}>
      <div className={styles.innerContainer}>
        {/* Header */}
        <div className={styles.header} style={{ background: getHeaderColor() }}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>🧾 ZIMBO – The Time-Bound Juggernaut</h1>
              <div className={styles.subHeader}>
                <p>Barbarian-Wizard Hybrid | Level {character.level} | Neutral Good</p>
                {character.statusEffects.length > 0 && (
                  <div className={styles.statusEffectsContainer}>
                    {character.statusEffects.map((effect) => (
                      <span
                        key={effect}
                        title={statusEffectTypes[effect]?.name}
                        className={styles.statusEffectIcon}
                      >
                        {statusEffectTypes[effect]?.icon}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.buttonRow}>
              <button
                onClick={undoLastAction}
                disabled={character.actionHistory.length === 0}
                className={`${styles.button} ${styles.undoButton}`}
                title="Undo last action"
              >
                ↶ Undo
              </button>
              <button
                onClick={() => setShowDamageModal(true)}
                className={`${styles.button} ${styles.damageButton}`}
              >
                💔 Take Damage
              </button>
              <button
                onClick={() => setShowStatusModal(true)}
                className={`${styles.button} ${styles.statusButton}`}
              >
                💀 Effects ({character.statusEffects.length + character.debilities.length})
              </button>
              <button
                onClick={() => setShowInventoryModal(true)}
                className={`${styles.button} ${styles.inventoryButton}`}
              >
                🎒 Inventory
              </button>
              <button
                onClick={bondsModal.open}
                className={`${styles.button} ${styles.bondsButton}`}
              >
                👥 Bonds ({character.bonds.filter((b) => !b.resolved).length})
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className={styles.grid}>
          {/* Stats Panel */}
          <CharacterStats
            character={character}
            setCharacter={setCharacter}
            saveToHistory={saveToHistory}
            totalArmor={totalArmor}
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
            equippedWeaponDamage={equippedWeaponDamage}
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
