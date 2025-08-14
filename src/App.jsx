import React, { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import {
  FaMeteor,
  FaRadiation,
  FaBoxOpen,
  FaUserAstronaut,
  FaSatellite,
  FaArrowRotateLeft,
  FaFlagCheckered,
} from 'react-icons/fa6';
import CharacterStats from './components/CharacterStats.jsx';
import DiceRoller from './components/DiceRoller.jsx';
import GameModals from './components/GameModals.jsx';
import InventoryPanel from './components/InventoryPanel.jsx';
import SessionNotes from './components/SessionNotes.jsx';
import CharacterAvatar from './components/CharacterAvatar.jsx';
import Settings from './components/Settings.jsx';
import useDiceRoller from './hooks/useDiceRoller';
import useInventory from './hooks/useInventory';
import useModal from './hooks/useModal.js';
import useStatusEffects from './hooks/useStatusEffects.js';
import useUndo from './hooks/useUndo.js';
import { statusEffectTypes, debilityTypes, RULEBOOK } from './state/character';
import { useCharacter } from './state/CharacterContext.jsx';
import styles from './styles/AppStyles.module.css';

const PerformanceHud =
  import.meta.env.DEV && import.meta.env.VITE_SHOW_PERFORMANCE_HUD === 'true'
    ? lazy(() => import('./components/PerformanceHud.jsx'))
    : null;

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
  const [showLastBreathModal, setShowLastBreathModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const getDefaultLevelUpState = () => ({
    selectedStats: [],
    selectedMove: '',
    hpIncrease: 0,
    newLevel: character.level + 1,
    expandedMove: '',
  });
  const [levelUpState, setLevelUpState] = useState(getDefaultLevelUpState);

  const {
    rollResult,
    setRollResult,
    rollHistory,
    rollDice,
    rollModal,
    rollModalData,
    rollDie,
    clearRollHistory,
  } = useDiceRoller(character, setCharacter);

  const { totalArmor, equippedWeaponDamage, handleEquipItem, handleConsumeItem, handleDropItem } =
    useInventory(character, setCharacter);

  // Auto-detect level up opportunity
  useEffect(() => {
    if (character.xp >= character.xpNeeded && !showLevelUpModal) {
      setLevelUpState((prev) => ({ ...prev, newLevel: character.level + 1 }));
      setShowLevelUpModal(true);
    }
  }, [character.xp, character.xpNeeded, character.level, showLevelUpModal]);

  // Reset level up state when modal closes or level changes
  useEffect(() => {
    if (!showLevelUpModal) {
      setLevelUpState(getDefaultLevelUpState());
    }
  }, [showLevelUpModal, character.level]);

  // Persist session notes
  useEffect(() => {
    if (sessionNotes) {
      localStorage.setItem('sessionNotes', sessionNotes);
    } else {
      localStorage.removeItem('sessionNotes');
    }
  }, [sessionNotes]);

  const { saveToHistory, undoLastAction } = useUndo(character, setCharacter, setRollResult);

  const {
    statusEffects,
    debilities,
    getActiveVisualEffects,
    getHeaderColor,
    toggleStatusEffect,
    toggleDebility,
  } = useStatusEffects(character, setCharacter);

  // Styles moved to CSS modules

  return (
    <div className={`${styles.container} ${getActiveVisualEffects()}`}>
      <div className={styles.innerContainer}>
        {/* Header */}
        <div className={styles.header} style={{ background: getHeaderColor() }}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>ZIMBO – The Time-Bound Juggernaut</h1>
              <div className={styles.subHeader}>
                <p>Barbarian-Wizard Hybrid | Level {character.level} | Neutral Good</p>
                <p>Rulebook: {RULEBOOK}</p>
                {character.statusEffects.length > 0 && (
                  <div className={styles.statusEffectsContainer}>
                    {character.statusEffects.map((effect) => {
                      const Icon = statusEffectTypes[effect]?.icon;
                      return (
                        <span
                          key={effect}
                          title={statusEffectTypes[effect]?.name}
                          className={styles.statusEffectIcon}
                        >
                          {Icon && <Icon />}
                        </span>
                      );
                    })}
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
                <FaArrowRotateLeft className={styles.icon} /> Undo
              </button>
              <button
                onClick={() => setShowDamageModal(true)}
                className={`${styles.button} ${styles.damageButton}`}
              >
                <FaMeteor className={styles.icon} /> Take Damage
              </button>
              <button
                onClick={() => setShowStatusModal(true)}
                className={`${styles.button} ${styles.statusButton}`}
              >
                <FaRadiation className={styles.icon} /> Effects (
                {statusEffects.length + debilities.length})
              </button>
              <button
                onClick={() => setShowInventoryModal(true)}
                className={`${styles.button} ${styles.inventoryButton}`}
              >
                <FaBoxOpen className={styles.icon} /> Inventory
              </button>
              <button
                onClick={bondsModal.open}
                className={`${styles.button} ${styles.bondsButton}`}
              >
                <FaUserAstronaut className={styles.icon} /> Bonds (
                {character.bonds.filter((b) => !b.resolved).length})
              </button>
              <button
                onClick={() => setShowEndSessionModal(true)}
                className={`${styles.button} ${styles.endSessionButton}`}
              >
                <FaFlagCheckered className={styles.icon} /> End Session
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className={`${styles.button} ${styles.exportButton}`}
              >
                <FaSatellite className={styles.icon} /> Export/Save
              </button>
              <Settings />
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className={styles.grid}>
          {/* Avatar Panel */}
          <CharacterAvatar character={character} />

          {/* Stats Panel */}
          <CharacterStats
            character={character}
            setCharacter={setCharacter}
            saveToHistory={saveToHistory}
            totalArmor={totalArmor}
            setShowLevelUpModal={setShowLevelUpModal}
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
        levelUpState={levelUpState}
        setLevelUpState={setLevelUpState}
        showLevelUpModal={showLevelUpModal}
        setShowLevelUpModal={setShowLevelUpModal}
        rollDie={rollDie}
        setRollResult={setRollResult}
        showStatusModal={showStatusModal}
        setShowStatusModal={setShowStatusModal}
        statusEffectTypes={statusEffectTypes}
        debilityTypes={debilityTypes}
        handleToggleStatusEffect={toggleStatusEffect}
        handleToggleDebility={toggleDebility}
        showDamageModal={showDamageModal}
        setShowDamageModal={setShowDamageModal}
        showLastBreathModal={showLastBreathModal}
        setShowLastBreathModal={setShowLastBreathModal}
        showInventoryModal={showInventoryModal}
        setShowInventoryModal={setShowInventoryModal}
        inventory={character.inventory}
        handleEquipItem={handleEquipItem}
        handleConsumeItem={handleConsumeItem}
        handleDropItem={handleDropItem}
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
        showEndSessionModal={showEndSessionModal}
        setShowEndSessionModal={setShowEndSessionModal}
        bondsModal={bondsModal}
      />
      {PerformanceHud && (
        <Suspense fallback={null}>
          <PerformanceHud />
        </Suspense>
      )}
    </div>
  );
}

export default App;
