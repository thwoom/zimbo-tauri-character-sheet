import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
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
import CharacterHUD from './components/CharacterHUD/CharacterHUD.jsx';
import Settings from './components/Settings.jsx';
import CharacterSwitcher from './components/CharacterSwitcher.jsx';
import AppVersion from './components/AppVersion.tsx';
import DiagnosticOverlay from './components/DiagnosticOverlay.jsx';
import Button from './components/common/Button.jsx';
import ButtonGroup from './components/common/ButtonGroup.jsx';
import useDiceRoller from './hooks/useDiceRoller';
import useInventory from './hooks/useInventory';
import useModal from './hooks/useModal.js';
import useStatusEffects from './hooks/useStatusEffects.js';
import useUndo from './hooks/useUndo.js';
import { statusEffectTypes, debilityTypes, RULEBOOK } from './state/character';
import { useCharacter } from './state/CharacterContext.jsx';
import { useSettings } from './state/SettingsContext.jsx';
import styles from './styles/AppStyles.module.css';
import safeLocalStorage from './utils/safeLocalStorage.js';

const PerformanceHud =
  import.meta.env.DEV && import.meta.env.VITE_SHOW_PERFORMANCE_HUD === 'true'
    ? lazy(() => import('./components/PerformanceHud.jsx'))
    : null;

function App() {
  const { character, setCharacter } = useCharacter();
  const { showDiagnostics } = useSettings();

  // UI State
  const bondsModal = useModal();
  const [sessionNotes, setSessionNotes] = useState(() =>
    safeLocalStorage.getItem('sessionNotes', 'My session note'),
  );
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [showLastBreathModal, setShowLastBreathModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [compactMode, setCompactMode] = useState(() => window.innerWidth < 768);
  const [hudMounted, setHudMounted] = useState(false);

  const getDefaultLevelUpState = () => ({
    selectedStats: [],
    selectedMove: '',
    hpIncrease: 0,
    newLevel: character.level + 1,
    expandedMove: '',
  });
  const [levelUpState, setLevelUpState] = useState(getDefaultLevelUpState);

  const saveToHistoryRef = useRef(() => {});
  const {
    rollResult,
    setRollResult,
    rollHistory,
    rollDice,
    rollModal,
    rollModalData,
    aidModal,
    rollDie,
    clearRollHistory,
  } = useDiceRoller(character, setCharacter, saveToHistoryRef);

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
      safeLocalStorage.setItem('sessionNotes', sessionNotes);
    } else {
      safeLocalStorage.removeItem('sessionNotes');
    }
  }, [sessionNotes]);

  const { saveToHistory, undoLastAction } = useUndo(character, setCharacter, setRollResult);
  saveToHistoryRef.current = saveToHistory;

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
            <CharacterSwitcher />
            <div>
              {/* eslint-disable-next-line jsx-a11y/tabindex-no-positive */}
              <h1 className={styles.title} tabIndex={1}>
                ZIMBO – The Time-Bound Juggernaut
              </h1>
              <div className={styles.subHeader}>
                <p>Barbarian-Wizard Hybrid | Level {character.level} | Neutral Good</p>
                <p>Rulebook: {RULEBOOK}</p>
                {character.statusEffects.length > 0 && (
                  <div className={styles.statusEffectsContainer}>
                    {character.statusEffects.map((effect, idx) => {
                      const Icon = statusEffectTypes[effect]?.icon;
                      const stacks = character.statusEffects.filter((e) => e === effect).length;
                      return (
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        <span
                          key={`${effect}-${idx}`}
                          tabIndex={5 + idx}
                          role="status"
                          aria-label={`${statusEffectTypes[effect]?.name}: ${statusEffectTypes[effect]?.description}. Stack count: ${stacks}`}
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
            <ButtonGroup>
              <Button
                onClick={undoLastAction}
                disabled={character.actionHistory.length === 0}
                className={styles.undoButton}
                title="Undo last action"
              >
                <FaArrowRotateLeft className={styles.icon} /> Undo
              </Button>
              <Button onClick={() => setShowDamageModal(true)} className={styles.damageButton}>
                <FaMeteor className={styles.icon} /> Take Damage
              </Button>
              <Button onClick={() => setShowStatusModal(true)} className={styles.statusButton}>
                <FaRadiation className={styles.icon} /> Effects (
                {statusEffects.length + debilities.length})
              </Button>
              <Button
                onClick={() => setShowInventoryModal(true)}
                className={styles.inventoryButton}
              >
                <FaBoxOpen className={styles.icon} /> Inventory
              </Button>
              <Button onClick={bondsModal.open} className={styles.bondsButton}>
                <FaUserAstronaut className={styles.icon} /> Bonds (
                {character.bonds.filter((b) => !b.resolved).length})
              </Button>
              <Button
                onClick={() => setShowEndSessionModal(true)}
                className={styles.endSessionButton}
              >
                <FaFlagCheckered className={styles.icon} /> End Session
              </Button>
              <Button onClick={() => setShowExportModal(true)} className={styles.exportButton}>
                <FaSatellite className={styles.icon} /> Export/Save
              </Button>
              <Settings />
            </ButtonGroup>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className={styles.grid}>
          {/* Avatar Panel */}
          <CharacterHUD onMountChange={setHudMounted} />

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
            aidModal={aidModal}
          />

          {/* Quick Inventory Panel */}
          <InventoryPanel
            character={character}
            setCharacter={setCharacter}
            rollDie={rollDie}
            setRollResult={setRollResult}
            saveToHistory={saveToHistory}
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

      {import.meta.env.DEV && showDiagnostics && <DiagnosticOverlay hudMounted={hudMounted} />}

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
        saveToHistory={saveToHistory}
      />
      {PerformanceHud && (
        <Suspense fallback={null}>
          <PerformanceHud />
        </Suspense>
      )}
      <AppVersion />
    </div>
  );
}

export default App;
