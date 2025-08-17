import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import styles from './LevelUpModal.module.css';
import { advancedMoves } from '../data/advancedMoves.js';
import { scoreToMod } from '../utils/score.js';
import Message from './Message';
import useModalTransition from './common/useModalTransition.js';

const LevelUpModal = ({
  character,
  setCharacter,
  levelUpState,
  setLevelUpState,
  onClose,
  rollDie,
  setRollResult,
}) => {
  const [showMoveDetails, setShowMoveDetails] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const modalRef = useRef(null);
  const [isVisible, isActive] = useModalTransition(true);

  useEffect(() => {
    if (!modalRef.current) return;
    modalRef.current.focus();

    const handleTabTrap = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = modalRef.current.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const node = modalRef.current;
    node.addEventListener('keydown', handleTabTrap);
    return () => node.removeEventListener('keydown', handleTabTrap);
  }, []);

  // Helper functions
  const canIncreaseTwo = () => {
    const validStats = Object.entries(character.stats)
      .filter(([, data]) => data.score < 16)
      .map(([stat]) => stat);
    return validStats.length >= 2;
  };

  const handleStatSelection = (stat) => {
    const currentScore = character.stats[stat].score;
    if (currentScore >= 18) return; // Max stat

    setLevelUpState((prev) => {
      const alreadySelected = prev.selectedStats.includes(stat);
      if (alreadySelected) {
        setValidationMessage('');
        return { ...prev, selectedStats: prev.selectedStats.filter((s) => s !== stat) };
      }

      // Can't select more than 2 stats
      if (prev.selectedStats.length >= 2) return prev;

      // If selecting a second stat, ensure its current score is below 16
      if (prev.selectedStats.length === 1) {
        if (currentScore >= 16) {
          setValidationMessage('Cannot select a second stat with a score of 16 or higher.');
          return prev;
        }
        if (!canIncreaseTwo()) return prev;
      }

      setValidationMessage('');
      return { ...prev, selectedStats: [...prev.selectedStats, stat] };
    });
  };

  const rollHPIncrease = () => {
    const roll = rollDie(10);
    const conMod = character.stats.CON.mod;
    const increase = Math.max(1, roll + conMod); // Minimum 1 HP gain

    setLevelUpState((prev) => ({ ...prev, hpIncrease: increase }));
    setRollResult(`HP Roll: d10(${roll}) + CON(${conMod}) = +${increase} HP`);

    setCharacter((prev) => ({
      ...prev,
      rollHistory: [
        {
          type: 'HP Roll',
          result: `+${increase} HP`,
          rolls: [roll],
          modifier: conMod,
          total: increase,
          timestamp: Date.now(),
        },
        ...(prev.rollHistory ? prev.rollHistory.slice(0, 9) : []),
      ],
    }));
  };

  const completeLevelUp = () => {
    if (
      levelUpState.selectedStats.length === 0 ||
      !levelUpState.selectedMove ||
      levelUpState.hpIncrease === 0
    ) {
      setValidationMessage(
        'Please complete all level up steps: select stats, choose a move, and roll for HP!',
      );
      return;
    }

    setValidationMessage('');

    // Update character stats
    const newStats = { ...character.stats };
    levelUpState.selectedStats.forEach((stat) => {
      newStats[stat] = {
        score: newStats[stat].score + 1,
        mod: scoreToMod(newStats[stat].score + 1),
      };
    });

    // Apply level up changes
    setCharacter((prev) => ({
      ...prev,
      level: levelUpState.newLevel,
      stats: newStats,
      maxHp: prev.maxHp + levelUpState.hpIncrease,
      hp: prev.maxHp + levelUpState.hpIncrease, // Heal to full when leveling
      xp: prev.xp - prev.xpNeeded,
      xpNeeded: levelUpState.newLevel + 7,
      selectedMoves: [...prev.selectedMoves, levelUpState.selectedMove],
      levelUpPending: false,
      actionHistory: [
        ...prev.actionHistory.slice(-4), // Keep last 4 actions
        {
          type: 'level_up',
          data: {
            oldLevel: prev.level,
            newLevel: levelUpState.newLevel,
            statsIncreased: levelUpState.selectedStats,
            moveGained: levelUpState.selectedMove,
            hpGained: levelUpState.hpIncrease,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }));

    // Reset level up state
    setLevelUpState({
      selectedStats: [],
      selectedMove: '',
      hpIncrease: 0,
      newLevel: levelUpState.newLevel,
      expandedMove: '',
    });

    setRollResult(
      `🎉 Welcome to Level ${levelUpState.newLevel}! ${levelUpState.selectedStats.join(' & ')} increased, gained "${advancedMoves[levelUpState.selectedMove].name}" move, +${levelUpState.hpIncrease} HP!`,
    );
    onClose();
  };

  const isComplete =
    levelUpState.selectedStats.length > 0 &&
    levelUpState.selectedMove &&
    levelUpState.hpIncrease > 0;

  // Class helpers
  const statButtonClass = (stat) => {
    const currentScore = character.stats[stat].score;
    const isSelected = levelUpState.selectedStats.includes(stat);
    const isMaxed = currentScore >= 18;
    const canSelect =
      !isMaxed &&
      (levelUpState.selectedStats.length === 0 ||
        (levelUpState.selectedStats.length === 1 && canIncreaseTwo()) ||
        isSelected);

    return [
      styles.statButton,
      isSelected && styles.selected,
      isMaxed && styles.maxed,
      !isSelected && !canSelect && styles.disabled,
    ]
      .filter(Boolean)
      .join(' ');
  };

  const moveButtonClass = (moveId) => {
    const isSelected = levelUpState.selectedMove === moveId;
    return [styles.moveButton, isSelected && styles.selected].filter(Boolean).join(' ');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleOverlayKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      aria-label="Close"
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        ref={modalRef}
        className={`${styles.modal} ${styles.modalEnter} ${isActive ? styles.modalEnterActive : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>LEVEL UP!</h2>
          <p className={styles.headerText}>
            {character.name} advances to Level {levelUpState.newLevel}
          </p>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className={styles.content}>
          {/* Progress Indicator */}
          <div className={styles.progress}>
            <div
              className={`${styles.progressStep} ${levelUpState.selectedStats.length > 0 ? styles.complete : ''}`}
            >
              <div className={styles.progressIcon}>
                {levelUpState.selectedStats.length > 0 ? '✅' : '1️⃣'}
              </div>
              <div className={styles.progressLabel}>Stats</div>
            </div>
            <div
              className={`${styles.progressStep} ${levelUpState.selectedMove ? styles.complete : ''}`}
            >
              <div className={styles.progressIcon}>{levelUpState.selectedMove ? '✅' : '2️⃣'}</div>
              <div className={styles.progressLabel}>Move</div>
            </div>
            <div
              className={`${styles.progressStep} ${levelUpState.hpIncrease > 0 ? styles.complete : ''}`}
            >
              <div className={styles.progressIcon}>{levelUpState.hpIncrease > 0 ? '✅' : '3️⃣'}</div>
              <div className={styles.progressLabel}>HP</div>
            </div>
          </div>

          {/* Step 1: Stat Selection */}
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>📊 Step 1: Increase Ability Scores</h3>
            <p className={styles.stepDesc}>
              Choose 1 stat (max 18) or 2 stats if both are under 16:
            </p>

            <div className={styles.statGrid}>
              {Object.entries(character.stats).map(([stat, data]) => (
                <button
                  key={stat}
                  onClick={() => handleStatSelection(stat)}
                  className={statButtonClass(stat)}
                  disabled={
                    data.score >= 18 ||
                    (!levelUpState.selectedStats.includes(stat) &&
                      levelUpState.selectedStats.length >= 2)
                  }
                >
                  <div className={styles.statName}>{stat}</div>
                  <div className={styles.statScore}>
                    {data.score} → {data.score >= 18 ? data.score : data.score + 1}
                    {data.score >= 18 && ' (MAX)'}
                  </div>
                  <div className={styles.statMod}>
                    ({data.mod >= 0 ? '+' : ''}
                    {data.mod} →{' '}
                    {Math.floor((Math.min(18, data.score + 1) - 10) / 2) >= 0 ? '+' : ''}
                    {Math.floor((Math.min(18, data.score + 1) - 10) / 2)})
                  </div>
                </button>
              ))}
            </div>

            {levelUpState.selectedStats.length > 0 && (
              <div className={styles.selectedBox}>
                Selected: {levelUpState.selectedStats.join(', ')}
              </div>
            )}
          </div>

          {/* Step 2: Advanced Move Selection */}
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>⚔️ Step 2: Choose Advanced Move</h3>
            <div className={styles.moveList}>
              {Object.entries(advancedMoves)
                .filter(([id]) => !character.selectedMoves.includes(id))
                .map(([id, move]) => (
                  <div key={id} className={styles.moveWrapper}>
                    <div
                      onClick={() => setLevelUpState((prev) => ({ ...prev, selectedMove: id }))}
                      className={moveButtonClass(id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        setLevelUpState((prev) => ({ ...prev, selectedMove: id }))
                      }
                    >
                      <div className={styles.moveHeader}>
                        <div className={styles.moveText}>
                          <h4 className={styles.moveName}>{move.name}</h4>
                          <p className={styles.moveDesc}>{move.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMoveDetails(showMoveDetails === id ? '' : id);
                          }}
                          className={styles.detailsButton}
                        >
                          {showMoveDetails === id ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>

                    {/* Expanded move details */}
                    {showMoveDetails === id && (
                      <div className={styles.moveDetails}>
                        <p className={styles.moveExpanded}>{move.expanded}</p>
                        <div className={styles.moveExamples}>
                          <strong>Examples:</strong>
                          <br />
                          {move.examples}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {levelUpState.selectedMove && (
              <div className={`${styles.selectedBox} ${styles.selectedMove}`}>
                Selected: {advancedMoves[levelUpState.selectedMove].name}
              </div>
            )}
          </div>

          {/* Step 3: HP Rolling */}
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>❤️ Step 3: Roll for Hit Points</h3>
            <div className={styles.hpContainer}>
              <button
                onClick={rollHPIncrease}
                className={`${styles.button} ${levelUpState.hpIncrease > 0 ? styles.buttonRolled : ''}`}
                disabled={levelUpState.hpIncrease > 0}
              >
                {levelUpState.hpIncrease > 0 ? '✅ HP Rolled' : '🎲 Roll d10 + CON'}
              </button>

              <div className={styles.hpText}>
                Roll d10 + CON ({character.stats.CON.mod >= 0 ? '+' : ''}
                {character.stats.CON.mod}) for HP increase
                {levelUpState.hpIncrease > 0 && (
                  <div className={styles.hpResult}>Result: +{levelUpState.hpIncrease} HP</div>
                )}
              </div>
            </div>
          </div>

          {/* Summary & Complete Button */}
          <div className={`${styles.summary} ${isComplete ? styles.complete : styles.incomplete}`}>
            <h4 className={styles.summaryTitle}>Level Up Summary</h4>
            <div className={styles.summaryDetails}>
              <div>
                Level: {character.level} → {levelUpState.newLevel}
              </div>
              <div>
                Stats:{' '}
                {levelUpState.selectedStats.length > 0
                  ? levelUpState.selectedStats.join(' & ')
                  : 'None selected'}
              </div>
              <div>
                Move:{' '}
                {levelUpState.selectedMove
                  ? advancedMoves[levelUpState.selectedMove].name
                  : 'None selected'}
              </div>
              <div>
                HP: {levelUpState.hpIncrease > 0 ? `+${levelUpState.hpIncrease}` : 'Not rolled'}
              </div>
            </div>

            <div className={styles.actions}>
              <button onClick={onClose} className={`${styles.button} ${styles.buttonCancel}`}>
                Cancel
              </button>

              <button
                onClick={completeLevelUp}
                disabled={!isComplete}
                className={`${styles.button} ${styles.buttonComplete} ${!isComplete ? styles.buttonDisabled : ''}`}
              >
                🚀 Complete Level Up!
              </button>
            </div>

            {validationMessage ? (
              <Message type="error">{validationMessage}</Message>
            ) : (
              !isComplete && (
                <Message type="warning">Complete all steps to finish leveling up</Message>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

LevelUpModal.propTypes = {
  character: PropTypes.object.isRequired,
  setCharacter: PropTypes.func.isRequired,
  levelUpState: PropTypes.object.isRequired,
  setLevelUpState: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  rollDie: PropTypes.func.isRequired,
  setRollResult: PropTypes.func.isRequired,
};

export default LevelUpModal;
