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
import FloatingDiceButton from './components/FloatingDiceButton';
import DiceRollerModal from './components/DiceRollerModal';
import GameModals from './components/GameModals';
import InventoryPanel from './components/InventoryPanel';
import SessionNotes from './components/SessionNotes';
import CharacterHUD from './components/CharacterHUD/CharacterHUD';
import Settings from './components/Settings';
import CommandPalette from './components/CommandPalette';
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
import './styles/print.css';
import safeLocalStorage from './utils/safeLocalStorage.js';
import { isCompactWidth } from './utils/responsive.js';
import VersionHistoryModal from './components/VersionHistoryModal';
import PrintableSheet from './components/PrintableSheet.jsx';

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
  const [showPromptsModal, setShowPromptsModal] = useState(false);
  // Default to false when `window` is unavailable (e.g., during SSR)
  // to prevent reference errors.
  const [compactMode, setCompactMode] = useState(isCompactWidth);
  const [hudMounted, setHudMounted] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showDiceRollerModal, setShowDiceRollerModal] = useState(false);
  const [versions, setVersions] = useState(() => {
    try {
      const raw = localStorage.getItem('characterVersions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

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

  const { saveToHistory, undoLastAction } = useUndo(character, setCharacter, setRollResult);
  saveToHistoryRef.current = saveToHistory;

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

  // Drag-and-drop import of character JSON
  useEffect(() => {
    const root = document;

    const onDragOver = (event) => {
      event.preventDefault();
      setIsDragActive(true);
    };

    const onDragLeave = (event) => {
      // Only deactivate when leaving the window or when no related target inside
      if (
        !event.relatedTarget ||
        !(event.currentTarget && event.currentTarget.contains?.(event.relatedTarget))
      ) {
        setIsDragActive(false);
      }
    };

    const onDrop = (event) => {
      event.preventDefault();
      setIsDragActive(false);
      try {
        const file = event.dataTransfer?.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(String(reader.result || ''));
            if (data && typeof data === 'object') {
              setCharacter(data);
            }
          } catch (error) {
            // ignore parse errors silently to avoid disrupting play
            // could surface a non-intrusive message in the future
          }
        };
        reader.readAsText(file);
      } catch (_) {
        // no-op
      }
    };

    root.addEventListener('dragover', onDragOver);
    root.addEventListener('dragleave', onDragLeave);
    root.addEventListener('drop', onDrop);
    return () => {
      root.removeEventListener('dragover', onDragOver);
      root.removeEventListener('dragleave', onDragLeave);
      root.removeEventListener('drop', onDrop);
    };
  }, [setCharacter]);

  // Global shortcut: Ctrl/Cmd+K opens command palette
  useEffect(() => {
    const onKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Poll versions for updates written by CharacterContext
  useEffect(() => {
    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem('characterVersions');
        const next = raw ? JSON.parse(raw) : [];
        if (JSON.stringify(next) !== JSON.stringify(versions)) setVersions(next);
      } catch {
        /* ignore */
      }
    }, 750);
    return () => clearInterval(id);
  }, [versions]);

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
    <div
      className={`${styles.container} ${getActiveVisualEffects()} ${isDragActive ? styles.dragActive : ''}`}
    >
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
                data-testid="open-inventory"
              >
                <FaBoxOpen className={styles.icon} /> Inventory
              </Button>
              <Button onClick={bondsModal.open} className={styles.bondsButton}>
                <FaUserAstronaut className={styles.icon} /> Bonds (
                {character.bonds.filter((b) => !b.resolved).length})
              </Button>
              <Button onClick={() => setShowPrint(true)} className={styles.bondsButton}>
                🖨️ Print
              </Button>
              <Button
                onClick={() => setShowEndSessionModal(true)}
                className={styles.endSessionButton}
              >
                <FaFlagCheckered className={styles.icon} /> End Session
              </Button>
              <Button onClick={() => setShowVersionsModal(true)} className={styles.bondsButton}>
                📜 Versions
              </Button>
              <Button
                onClick={() => setShowExportModal(true)}
                className={styles.exportButton}
                data-testid="open-export"
              >
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
        showPromptsModal={showPromptsModal}
        setShowPromptsModal={setShowPromptsModal}
        bondsModal={bondsModal}
        saveToHistory={saveToHistory}
        showAddItemModal={showAddItemModal}
        setShowAddItemModal={setShowAddItemModal}
      />
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        commands={[
          {
            id: 'open-inventory',
            label: 'Open Inventory',
            action: () => setShowInventoryModal(true),
          },
          {
            id: 'open-status',
            label: 'Toggle Status Effects',
            action: () => setShowStatusModal(true),
          },
          { id: 'open-bonds', label: 'Open Bonds', action: () => bondsModal.open() },
          {
            id: 'open-dice-roller',
            label: 'Open Dice Roller',
            action: () => setShowDiceRollerModal(true),
          },
          {
            id: 'open-end-session',
            label: 'End Session',
            action: () => setShowEndSessionModal(true),
          },
          { id: 'open-export', label: 'Export / Import', action: () => setShowExportModal(true) },
          { id: 'roll-int', label: 'Roll INT Check', action: () => rollDice('2d6+0', 'INT Check') },
          {
            id: 'roll-damage',
            label: 'Roll Weapon Damage',
            action: () => rollDice(equippedWeaponDamage, 'Weapon Damage'),
          },
        ]}
      />
      <VersionHistoryModal
        isOpen={showVersionsModal}
        onClose={() => setShowVersionsModal(false)}
        versions={versions}
        onRestore={(data) => setCharacter(data)}
      />
      {showPrint && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000 }}
          onClick={() => setShowPrint(false)}
          data-hide-on-print="true"
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '5%',
              transform: 'translateX(-50%)',
              width: 'min(900px, 95vw)',
              background: '#fff',
              color: '#000',
              borderRadius: 8,
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Print Preview</h2>
              <div>
                <button onClick={() => window.print()} style={{ marginRight: 8 }}>
                  Print
                </button>
                <button onClick={() => setShowPrint(false)}>Close</button>
              </div>
            </div>
            <div className="print-container">
              <PrintableSheet character={character} />
            </div>
          </div>
        </div>
      )}
      {/* Floating Dice Button */}
      <FloatingDiceButton
        onClick={() => setShowDiceRollerModal(true)}
        isOpen={showDiceRollerModal}
      />

      {/* Dice Roller Modal */}
      <DiceRollerModal
        isOpen={showDiceRollerModal}
        onClose={() => setShowDiceRollerModal(false)}
        character={character}
        rollDice={rollDice}
        rollResult={rollResult}
        rollHistory={rollHistory}
        equippedWeaponDamage={equippedWeaponDamage}
        rollModal={rollModal}
        rollModalData={rollModalData}
        aidModal={aidModal}
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
