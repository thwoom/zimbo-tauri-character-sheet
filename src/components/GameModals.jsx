import PropTypes from 'prop-types';
import React from 'react';
import BondsModal from './BondsModal';
import DamageModal from './DamageModal';
import ExportModal from './ExportModal';
import EndSessionModal from './EndSessionModal';
import InventoryModal from './InventoryModal';
import AddItemModal from './AddItemModal';
import LastBreathModal from './LastBreathModal';
import LevelUpModal from './LevelUpModal';
import StatusModal from './StatusModal';
import PromptsModal from './PromptsModal';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';

const GameModals = ({
  character,
  setCharacter,
  levelUpState,
  setLevelUpState,
  showLevelUpModal,
  setShowLevelUpModal,
  rollDie,
  setRollResult,
  showStatusModal,
  setShowStatusModal,
  statusEffectTypes,
  debilityTypes,
  handleToggleStatusEffect,
  handleToggleDebility,
  showDamageModal,
  setShowDamageModal,
  showLastBreathModal,
  setShowLastBreathModal,
  showInventoryModal,
  setShowInventoryModal,
  showAddItemModal,
  setShowAddItemModal,
  inventory,
  handleEquipItem,
  handleConsumeItem,
  handleDropItem,
  handleUpdateNotes = () => {},
  handleAddItem,
  showExportModal,
  setShowExportModal,
  showEndSessionModal,
  setShowEndSessionModal,
  showPromptsModal,
  setShowPromptsModal,
  bondsModal,
  saveToHistory,
}) => {
  // eslint-disable-next-line no-console
  // GameModals flags
  /* console.debug('GameModals flags', {
    showLevelUpModal,
    showStatusModal,
    showDamageModal,
    showLastBreathModal,
    showInventoryModal,
    showAddItemModal,
    showExportModal,
    showEndSessionModal,
  }); */
  return (
    <>
      {showLevelUpModal && (
        <LevelUpModal
          isOpen
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
          isOpen
          statusEffects={character.statusEffects}
          debilities={character.debilities}
          statusEffectTypes={statusEffectTypes}
          debilityTypes={debilityTypes}
          onToggleStatusEffect={handleToggleStatusEffect}
          onToggleDebility={handleToggleDebility}
          onClose={() => setShowStatusModal(false)}
          saveToHistory={saveToHistory}
        />
      )}

      {showDamageModal && (
        <DamageModal
          isOpen
          onClose={() => setShowDamageModal(false)}
          onLastBreath={() => setShowLastBreathModal(true)}
        />
      )}

      {showLastBreathModal && (
        <LastBreathModal isOpen onClose={() => setShowLastBreathModal(false)} rollDie={rollDie} />
      )}

      {showInventoryModal && (
        <InventoryModal
          isOpen
          inventory={inventory}
          onEquip={handleEquipItem}
          onConsume={handleConsumeItem}
          onDrop={handleDropItem}
          onUpdateNotes={handleUpdateNotes}
          onClose={() => setShowInventoryModal(false)}
        />
      )}

      {showAddItemModal && (
        <AddItemModal isOpen onAdd={handleAddItem} onClose={() => setShowAddItemModal(false)} />
      )}

      {bondsModal.isOpen && <BondsModal isOpen onClose={bondsModal.close} />}

      {showEndSessionModal && (
        <EndSessionModal
          isOpen
          onClose={() => setShowEndSessionModal(false)}
          onLevelUp={() => setShowLevelUpModal(true)}
        />
      )}

      {showExportModal && <ExportModal isOpen onClose={() => setShowExportModal(false)} />}

      {showPromptsModal && <PromptsModal isOpen onClose={() => setShowPromptsModal(false)} />}
    </>
  );
};

GameModals.propTypes = {
  character: PropTypes.object.isRequired,
  setCharacter: PropTypes.func.isRequired,
  levelUpState: PropTypes.object.isRequired,
  setLevelUpState: PropTypes.func.isRequired,
  showLevelUpModal: PropTypes.bool.isRequired,
  setShowLevelUpModal: PropTypes.func.isRequired,
  rollDie: PropTypes.func.isRequired,
  setRollResult: PropTypes.func.isRequired,
  showStatusModal: PropTypes.bool.isRequired,
  setShowStatusModal: PropTypes.func.isRequired,
  statusEffectTypes: PropTypes.object.isRequired,
  debilityTypes: PropTypes.object.isRequired,
  handleToggleStatusEffect: PropTypes.func.isRequired,
  handleToggleDebility: PropTypes.func.isRequired,
  showDamageModal: PropTypes.bool.isRequired,
  setShowDamageModal: PropTypes.func.isRequired,
  showLastBreathModal: PropTypes.bool.isRequired,
  setShowLastBreathModal: PropTypes.func.isRequired,
  showInventoryModal: PropTypes.bool.isRequired,
  setShowInventoryModal: PropTypes.func.isRequired,
  showAddItemModal: PropTypes.bool.isRequired,
  setShowAddItemModal: PropTypes.func.isRequired,
  inventory: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleEquipItem: PropTypes.func.isRequired,
  handleConsumeItem: PropTypes.func.isRequired,
  handleDropItem: PropTypes.func.isRequired,
  handleUpdateNotes: PropTypes.func,
  handleAddItem: PropTypes.func.isRequired,
  showExportModal: PropTypes.bool.isRequired,
  setShowExportModal: PropTypes.func.isRequired,
  showEndSessionModal: PropTypes.bool.isRequired,
  setShowEndSessionModal: PropTypes.func.isRequired,
  showPromptsModal: PropTypes.bool.isRequired,
  setShowPromptsModal: PropTypes.func.isRequired,
  bondsModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
  }).isRequired,
  saveToHistory: PropTypes.func.isRequired,
};

export default GameModals;
