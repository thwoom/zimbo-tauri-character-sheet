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
import CharacterStats from './components/CharacterStats';
import DiceRoller from './components/DiceRoller';
import GameModals from './components/GameModals';
import InventoryPanel from './components/InventoryPanel';
import SessionNotes from './components/SessionNotes';
import CharacterHUD from './components/CharacterHUD/CharacterHUD';
import Settings from './components/Settings';
import CharacterSwitcher from './components/CharacterSwitcher';
import AppVersion from './components/AppVersion';
import DiagnosticOverlay from './components/DiagnosticOverlay';
import Button from './components/common/Button';
import ButtonGroup from './components/common/ButtonGroup';
import useDiceRoller from './hooks/useDiceRoller';
import useInventory from './hooks/useInventory';
import useModal from './hooks/useModal.js';
import useStatusEffects from './hooks/useStatusEffects.js';
import useUndo from './hooks/useUndo.js';
import { statusEffectTypes, debilityTypes, RULEBOOK } from './state/character';
import { useCharacter } from './state/CharacterContext';
import { useSettings } from './state/SettingsContext';
import styles from './styles/AppStyles.module.css';
import safeLocalStorage from './utils/safeLocalStorage.js';

const PerformanceHud =
  import.meta.env.DEV && import.meta.env.VITE_SHOW_PERFORMANCE_HUD === 'true'
    ? lazy(() => import('./components/PerformanceHud'))
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
  const [showAddItemModal, setShowAddItemModal] = useState(false);
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
  const headerRef = useRef(null);
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

  const {
    totalArmor,
    equippedWeaponDamage,
    handleEquipItem,
    handleConsumeItem,
    handleDropItem,
    handleUpdateNotes,
  } = useInventory(character, setCharacter);

  const handleAddItem = React.useCallback(
    (item) => {
      setCharacter((prev) => ({
        ...prev,
        inventory: [...prev.inventory, { id: Date.now().toString(), ...item }],
      }));
      saveToHistory('Inventory Change');
    },
    [setCharacter, saveToHistory],
  );

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

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          '--header-height',
          `${headerRef.current.offsetHeight}px`,
        );
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

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
        <div ref={headerRef} className={styles.header} style={{ background: getHeaderColor() }}>
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
          <div className={styles.hud}>
            <CharacterHUD onMountChange={setHudMounted} />
          </div>

          {/* Stats Panel */}
          <div className={styles.stats}>
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
          </div>

          {/* Dice Roller Panel (component-based, main branch design) */}
          <div className={styles.dice}>
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
          </div>

          {/* Quick Inventory Panel */}
          <div className={styles.inventory}>
            <InventoryPanel
              character={character}
              setCharacter={setCharacter}
              rollDie={rollDie}
              setRollResult={setRollResult}
              saveToHistory={saveToHistory}
              setShowAddItemModal={setShowAddItemModal}
            />
          </div>

          {/* Session Notes Panel */}
          <div className={styles.notes}>
            <SessionNotes
              sessionNotes={sessionNotes}
              setSessionNotes={setSessionNotes}
              compactMode={compactMode}
              setCompactMode={setCompactMode}
            />
          </div>
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
        handleAddItem={handleAddItem}
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
        showEndSessionModal={showEndSessionModal}
        setShowEndSessionModal={setShowEndSessionModal}
        bondsModal={bondsModal}
        saveToHistory={saveToHistory}
        showAddItemModal={showAddItemModal}
        setShowAddItemModal={setShowAddItemModal}
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
