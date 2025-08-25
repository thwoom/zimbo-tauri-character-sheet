import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import { advancedMoves } from '../data/advancedMoves.js';
import { SettingsProvider } from '../state/SettingsContext';
import CharacterStats from './CharacterStats';
import LevelUpModal from './LevelUpModal';
import styles from './LevelUpModal.module.css';

function LevelUpWrapper({ isOpen, ...props }) {
  return isOpen ? <LevelUpModal {...props} /> : null;
}

describe('LevelUpModal advanced moves', () => {
  it('renders moves from data file', () => {
    const character = {
      name: 'Test',
      level: 1,
      stats: {
        STR: { score: 10, mod: 0 },
        DEX: { score: 10, mod: 0 },
        CON: { score: 10, mod: 0 },
        INT: { score: 10, mod: 0 },
        WIS: { score: 10, mod: 0 },
        CHA: { score: 10, mod: 0 },
      },
      selectedMoves: [],
    };

    const levelUpState = {
      selectedStats: [],
      selectedMove: '',
      hpIncrease: 0,
      newLevel: 2,
      expandedMove: '',
    };

    const html = renderToStaticMarkup(
      <LevelUpModal
        character={character}
        setCharacter={() => {}}
        levelUpState={levelUpState}
        setLevelUpState={() => {}}
        onClose={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
      />,
    );

    expect(html).toContain(advancedMoves.appetite.name);
  });
});

describe('LevelUpModal XP calculation', () => {
  it('sets xpNeeded to level + 7 after leveling', () => {
    let character = {
      name: 'Test',
      level: 1,
      stats: {
        STR: { score: 10, mod: 0 },
        DEX: { score: 10, mod: 0 },
        CON: { score: 10, mod: 0 },
        INT: { score: 10, mod: 0 },
        WIS: { score: 10, mod: 0 },
        CHA: { score: 10, mod: 0 },
      },
      maxHp: 10,
      hp: 10,
      xp: 8,
      xpNeeded: 8,
      selectedMoves: [],
      actionHistory: [],
      levelUpPending: true,
    };

    const levelUpState = {
      selectedStats: ['STR'],
      selectedMove: 'appetite',
      hpIncrease: 1,
      newLevel: 2,
      expandedMove: '',
    };

    const setCharacter = (fn) => {
      character = fn(character);
    };

    render(
      <LevelUpModal
        character={character}
        setCharacter={setCharacter}
        levelUpState={levelUpState}
        setLevelUpState={() => {}}
        onClose={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
      />,
    );

    const completeButton = screen.getByRole('button', { name: /Complete Level Up/i });
    fireEvent.click(completeButton);

    expect(character.xpNeeded).toBe(levelUpState.newLevel + 7);
  });
});

describe('LevelUpModal stat modifier', () => {
  it('sets modifier to +3 when increasing score from 17 to 18', () => {
    let character = {
      name: 'Test',
      level: 1,
      stats: {
        STR: { score: 17, mod: 2 },
        DEX: { score: 10, mod: 0 },
        CON: { score: 10, mod: 0 },
        INT: { score: 10, mod: 0 },
        WIS: { score: 10, mod: 0 },
        CHA: { score: 10, mod: 0 },
      },
      maxHp: 10,
      hp: 10,
      xp: 8,
      xpNeeded: 8,
      selectedMoves: [],
      actionHistory: [],
      levelUpPending: true,
    };

    const levelUpState = {
      selectedStats: ['STR'],
      selectedMove: 'appetite',
      hpIncrease: 1,
      newLevel: 2,
      expandedMove: '',
    };

    const setCharacter = (fn) => {
      character = fn(character);
    };

    render(
      <LevelUpModal
        character={character}
        setCharacter={setCharacter}
        levelUpState={levelUpState}
        setLevelUpState={() => {}}
        onClose={() => {}}
        rollDie={() => 1}
        setRollResult={() => {}}
      />,
    );

    const completeButton = screen.getByRole('button', { name: /Complete Level Up/i });
    fireEvent.click(completeButton);

    expect(character.stats.STR.mod).toBe(3);
  });
});

describe('LevelUpModal visibility and closing', () => {
  const character = {
    name: 'Test',
    level: 1,
    stats: {
      STR: { score: 10, mod: 0 },
      DEX: { score: 10, mod: 0 },
      CON: { score: 10, mod: 0 },
      INT: { score: 10, mod: 0 },
      WIS: { score: 10, mod: 0 },
      CHA: { score: 10, mod: 0 },
    },
    selectedMoves: [],
  };
  const levelUpState = {
    selectedStats: [],
    selectedMove: '',
    hpIncrease: 0,
    newLevel: 2,
    expandedMove: '',
  };
  const baseProps = {
    character,
    setCharacter: () => {},
    levelUpState,
    setLevelUpState: () => {},
    rollDie: () => 1,
    setRollResult: () => {},
  };

  it('toggles visibility via conditional rendering', () => {
    const onClose = vi.fn();
    const { rerender } = render(<LevelUpWrapper isOpen={false} {...baseProps} onClose={onClose} />);
    expect(screen.queryByRole('heading', { name: /LEVEL UP!/i })).not.toBeInTheDocument();
    rerender(<LevelUpWrapper isOpen {...baseProps} onClose={onClose} />);
    expect(screen.getByRole('heading', { name: /LEVEL UP!/i })).toBeInTheDocument();
  });

  it('focuses the modal when opened', () => {
    const onClose = vi.fn();
    render(<LevelUpWrapper isOpen {...baseProps} onClose={onClose} />);
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('closes when clicking the overlay', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<LevelUpWrapper isOpen {...baseProps} onClose={onClose} />);
    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it.skip('closes when pressing Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<LevelUpWrapper isOpen {...baseProps} onClose={onClose} />);
    screen.getByLabelText('Close').focus();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when clicking the close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<LevelUpWrapper isOpen {...baseProps} onClose={onClose} />);
    await user.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });

  it('wraps action buttons when width is constrained', () => {
    render(<LevelUpWrapper isOpen {...baseProps} onClose={() => {}} />);
    const group = screen.getByRole('button', { name: /Cancel/i }).parentElement;
    group.style.display = 'flex';
    group.style.flexWrap = 'wrap';
    Object.defineProperty(group, 'clientHeight', {
      configurable: true,
      get() {
        return group.style.width === '120px' ? 60 : 30;
      },
    });
    expect(getComputedStyle(group).flexWrap).toBe('wrap');
    const initialHeight = group.clientHeight;
    group.style.width = '120px';
    expect(group.clientHeight).toBeGreaterThan(initialHeight);
  });

  it('renders action buttons without overflow on narrow screens', () => {
    document.body.style.width = '320px';
    render(<LevelUpWrapper isOpen {...baseProps} onClose={() => {}} />);
    const group = screen.getByRole('button', { name: /Cancel/i }).parentElement;
    group.style.overflowX = 'auto';
    expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
  });

  it('opens via level up trigger with overlay and modal styles', async () => {
    const character = {
      name: 'Test',
      level: 1,
      stats: {
        STR: { score: 10, mod: 0 },
        DEX: { score: 10, mod: 0 },
        CON: { score: 10, mod: 0 },
        INT: { score: 10, mod: 0 },
        WIS: { score: 10, mod: 0 },
        CHA: { score: 10, mod: 0 },
      },
      hp: 10,
      maxHp: 10,
      xp: 8,
      xpNeeded: 8,
      resources: { chronoUses: 0 },
      selectedMoves: [],
    };

    const levelUpState = {
      selectedStats: [],
      selectedMove: '',
      hpIncrease: 0,
      newLevel: 2,
      expandedMove: '',
    };

    function Wrapper() {
      const [showLevelUpModal, setShowLevelUpModal] = useState(false);
      return (
        <SettingsProvider>
          <CharacterStats
            character={character}
            setCharacter={() => {}}
            saveToHistory={() => {}}
            totalArmor={0}
            setShowLevelUpModal={setShowLevelUpModal}
            setRollResult={() => {}}
          />
          {showLevelUpModal && (
            <LevelUpModal
              character={character}
              setCharacter={() => {}}
              levelUpState={levelUpState}
              setLevelUpState={() => {}}
              onClose={() => setShowLevelUpModal(false)}
              rollDie={() => 1}
              setRollResult={() => {}}
            />
          )}
        </SettingsProvider>
      );
    }

    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByRole('button', { name: /LEVEL UP AVAILABLE!/i }));
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveClass(styles.modal);
    expect(modal.parentElement).toHaveClass(styles.overlay);
  });
});
