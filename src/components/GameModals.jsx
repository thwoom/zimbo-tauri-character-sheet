import PropTypes from 'prop-types';
import React from 'react';
import BondsModal from './BondsModal.jsx';
import DamageModal from './DamageModal.jsx';
import ExportModal from './ExportModal.jsx';
import EndSessionModal from './EndSessionModal.jsx';
import InventoryModal from './InventoryModal.jsx';
import LastBreathModal from './LastBreathModal.jsx';
import LevelUpModal from './LevelUpModal.jsx';
import StatusModal from './StatusModal.jsx';

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
  inventory,
  handleEquipItem,
  handleConsumeItem,
  handleDropItem,
  showExportModal,
  setShowExportModal,
  showEndSessionModal,
  setShowEndSessionModal,
  bondsModal,
}) => (
  <>
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

    {showInventoryModal && (
      <InventoryModal
        inventory={inventory}
        onEquip={handleEquipItem}
        onConsume={handleConsumeItem}
        onDrop={handleDropItem}
        onClose={() => setShowInventoryModal(false)}
      />
    )}

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
  inventory: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleEquipItem: PropTypes.func.isRequired,
  handleConsumeItem: PropTypes.func.isRequired,
  handleDropItem: PropTypes.func.isRequired,
  showExportModal: PropTypes.bool.isRequired,
  setShowExportModal: PropTypes.func.isRequired,
  showEndSessionModal: PropTypes.bool.isRequired,
  setShowEndSessionModal: PropTypes.func.isRequired,
  bondsModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
  }).isRequired,
};

export default GameModals;
