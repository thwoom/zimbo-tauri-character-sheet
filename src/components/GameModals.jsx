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
  handleAddItem,
  showExportModal,
  setShowExportModal,
  showEndSessionModal,
  setShowEndSessionModal,
  bondsModal,
  saveToHistory,
}) => (
  <>
    <LevelUpModal
      isOpen={showLevelUpModal}
      character={character}
      setCharacter={setCharacter}
      levelUpState={levelUpState}
      setLevelUpState={setLevelUpState}
      onClose={() => setShowLevelUpModal(false)}
      rollDie={rollDie}
      setRollResult={setRollResult}
    />

    <StatusModal
      isOpen={showStatusModal}
      statusEffects={character.statusEffects}
      debilities={character.debilities}
      statusEffectTypes={statusEffectTypes}
      debilityTypes={debilityTypes}
      onToggleStatusEffect={handleToggleStatusEffect}
      onToggleDebility={handleToggleDebility}
      onClose={() => setShowStatusModal(false)}
      saveToHistory={saveToHistory}
    />

    <DamageModal
      isOpen={showDamageModal}
      onClose={() => setShowDamageModal(false)}
      onLastBreath={() => setShowLastBreathModal(true)}
    />

    <LastBreathModal
      isOpen={showLastBreathModal}
      onClose={() => setShowLastBreathModal(false)}
      rollDie={rollDie}
    />

    <InventoryModal
      isOpen={showInventoryModal}
      inventory={inventory}
      onEquip={handleEquipItem}
      onConsume={handleConsumeItem}
      onDrop={handleDropItem}
      onUpdateNotes={handleUpdateNotes}
      onClose={() => setShowInventoryModal(false)}
    />

    <AddItemModal
      isOpen={showAddItemModal}
      onAdd={handleAddItem}
      onClose={() => setShowAddItemModal(false)}
    />

    <BondsModal isOpen={bondsModal.isOpen} onClose={bondsModal.close} />

    <EndSessionModal
      isOpen={showEndSessionModal}
      onClose={() => setShowEndSessionModal(false)}
      onLevelUp={() => setShowLevelUpModal(true)}
    />

    <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
  </>
);

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
  handleAddItem: PropTypes.func.isRequired,
  showExportModal: PropTypes.bool.isRequired,
  setShowExportModal: PropTypes.func.isRequired,
  showEndSessionModal: PropTypes.bool.isRequired,
  setShowEndSessionModal: PropTypes.func.isRequired,
  bondsModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
  }).isRequired,
  saveToHistory: PropTypes.func.isRequired,
};

export default GameModals;
