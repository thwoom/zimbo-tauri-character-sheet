import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { statusEffectTypes, debilityTypes } from '../state/character.js';
import { CharacterProvider, useCharacter } from '../state/CharacterContext';
import GameModals from './GameModals';

function Wrapper(props) {
  const { character, setCharacter } = useCharacter();
  return (
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
      rollDie={() => 3}
      setRollResult={() => {}}
      statusEffectTypes={statusEffectTypes}
      debilityTypes={debilityTypes}
      handleToggleStatusEffect={() => {}}
      handleToggleDebility={() => {}}
      inventory={character.inventory}
      handleEquipItem={() => {}}
      handleConsumeItem={() => {}}
      handleDropItem={() => {}}
      handleUpdateNotes={() => {}}
      {...props}
    />
  );
}

const baseProps = {
  showLevelUpModal: false,
  setShowLevelUpModal: () => {},
  showStatusModal: false,
  setShowStatusModal: () => {},
  showDamageModal: false,
  setShowDamageModal: () => {},
  showLastBreathModal: false,
  setShowLastBreathModal: () => {},
  showInventoryModal: false,
  setShowInventoryModal: () => {},
  showAddItemModal: false,
  setShowAddItemModal: () => {},
  showExportModal: false,
  setShowExportModal: () => {},
  showEndSessionModal: false,
  setShowEndSessionModal: () => {},
  bondsModal: { isOpen: false, close: () => {} },
  saveToHistory: () => {},
  handleAddItem: () => {},
};

const renderModals = (props) =>
  render(
    <CharacterProvider>
      <Wrapper {...baseProps} {...props} />
    </CharacterProvider>,
  );

describe('GameModals', () => {
  it('toggles LevelUpModal with showLevelUpModal', () => {
    const { rerender } = renderModals();
    expect(screen.queryByRole('heading', { level: 2, name: /level up!/i })).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} showLevelUpModal />
      </CharacterProvider>,
    );
    expect(screen.getByRole('heading', { level: 2, name: /level up!/i })).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByRole('heading', { level: 2, name: /level up!/i })).not.toBeInTheDocument();
  });

  it('toggles StatusModal with showStatusModal', () => {
    const { rerender } = renderModals();
    expect(screen.queryByRole('heading', { name: /status & debilities/i })).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} showStatusModal />
      </CharacterProvider>,
    );
    expect(screen.getByRole('heading', { name: /status & debilities/i })).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByRole('heading', { name: /status & debilities/i })).not.toBeInTheDocument();
  });

  it('toggles DamageModal with showDamageModal', () => {
    const { rerender } = renderModals();
    expect(screen.queryByText(/damage calculator/i)).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} showDamageModal />
      </CharacterProvider>,
    );
    expect(screen.getByText(/damage calculator/i)).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByText(/damage calculator/i)).not.toBeInTheDocument();
  });

  it('toggles LastBreathModal with showLastBreathModal', async () => {
    const { rerender } = renderModals();
    expect(screen.queryByText(/last breath/i)).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} showLastBreathModal />
      </CharacterProvider>,
    );
    expect(await screen.findByText(/last breath/i)).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByText(/last breath/i)).not.toBeInTheDocument();
  });

  it('toggles InventoryModal with showInventoryModal', () => {
    const { rerender } = renderModals();
    expect(screen.queryByRole('heading', { name: /inventory/i })).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} showInventoryModal />
      </CharacterProvider>,
    );
    expect(screen.getByRole('heading', { name: /inventory/i })).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByRole('heading', { name: /inventory/i })).not.toBeInTheDocument();
  });

  it('toggles AddItemModal with showAddItemModal', () => {
    const { rerender } = renderModals();
    expect(screen.queryByText(/add item/i)).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} showAddItemModal />
      </CharacterProvider>,
    );
    expect(screen.getByText(/add item/i)).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByText(/add item/i)).not.toBeInTheDocument();
  });

  it('toggles BondsModal with bondsModal.isOpen', () => {
    const { rerender } = renderModals();
    expect(screen.queryByText(/character bonds/i)).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} bondsModal={{ isOpen: true, close: () => {} }} />
      </CharacterProvider>,
    );
    expect(screen.getByText(/character bonds/i)).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByText(/character bonds/i)).not.toBeInTheDocument();
  });

  it('toggles EndSessionModal with showEndSessionModal', () => {
    const { rerender } = renderModals();
    expect(screen.queryByText(/end of session/i)).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} showEndSessionModal />
      </CharacterProvider>,
    );
    expect(screen.getByText(/end of session/i)).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByText(/end of session/i)).not.toBeInTheDocument();
  });

  it('toggles ExportModal with showExportModal', () => {
    const { rerender } = renderModals();
    expect(screen.queryByText(/export \/ import/i)).not.toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} showExportModal />
      </CharacterProvider>,
    );
    expect(screen.getByText(/export \/ import/i)).toBeInTheDocument();
    rerender(
      <CharacterProvider>
        <Wrapper {...baseProps} />
      </CharacterProvider>,
    );
    expect(screen.queryByText(/export \/ import/i)).not.toBeInTheDocument();
  });
});
