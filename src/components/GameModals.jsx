import React from 'react';
import BondsModal from './BondsModal.jsx';
import DamageModal from './DamageModal.jsx';
import InventoryModal from './InventoryModal.jsx';
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
  showInventoryModal,
  setShowInventoryModal,
  inventory,
  handleEquipItem,
  handleConsumeItem,
  handleDropItem,
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

    <DamageModal isOpen={showDamageModal} onClose={() => setShowDamageModal(false)} />

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
  </>
);

export default GameModals;
