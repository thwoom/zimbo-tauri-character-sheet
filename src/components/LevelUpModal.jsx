import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import './LevelUpModal.css';
import { advancedMoves } from '../data/advancedMoves.js';
import Message from './Message.jsx';

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

    // Add visual feedback
    const rollHistory = {
      type: 'HP Roll',
      result: `+${increase} HP`,
      rolls: [roll],
      modifier: conMod,
      total: increase,
      timestamp: new Date().toLocaleTimeString(),
    };

    return rollHistory;
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
        mod: Math.floor((newStats[stat].score + 1 - 10) / 2),
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
      'levelup-stat-button',
      isSelected && 'selected',
      isMaxed && 'maxed',
      !isSelected && !canSelect && 'disabled',
    ]
      .filter(Boolean)
      .join(' ');
  };

  const moveButtonClass = (moveId) => {
    const isSelected = levelUpState.selectedMove === moveId;
    return ['levelup-move-button', isSelected && 'selected'].filter(Boolean).join(' ');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleOverlayKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
    <div
      className="levelup-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      aria-label="Close"
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        ref={modalRef}
        className="levelup-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="levelup-header">
          <h2 className="levelup-header-title">LEVEL UP!</h2>
          <p className="levelup-header-text">
            {character.name} advances to Level {levelUpState.newLevel}
          </p>
          <button onClick={onClose} className="levelup-close-button" aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="levelup-content">
          {/* Progress Indicator */}
          <div className="levelup-progress">
            <div
              className={`levelup-progress-step ${levelUpState.selectedStats.length > 0 ? 'complete' : ''}`}
            >
              <div className="levelup-progress-icon">
                {levelUpState.selectedStats.length > 0 ? '✅' : '1️⃣'}
              </div>
              <div className="levelup-progress-label">Stats</div>
            </div>
            <div className={`levelup-progress-step ${levelUpState.selectedMove ? 'complete' : ''}`}>
              <div className="levelup-progress-icon">{levelUpState.selectedMove ? '✅' : '2️⃣'}</div>
              <div className="levelup-progress-label">Move</div>
            </div>
            <div
              className={`levelup-progress-step ${levelUpState.hpIncrease > 0 ? 'complete' : ''}`}
            >
              <div className="levelup-progress-icon">
                {levelUpState.hpIncrease > 0 ? '✅' : '3️⃣'}
              </div>
              <div className="levelup-progress-label">HP</div>
            </div>
          </div>

          {/* Step 1: Stat Selection */}
          <div className="levelup-step">
            <h3 className="levelup-step-title">📊 Step 1: Increase Ability Scores</h3>
            <p className="levelup-step-desc">
              Choose 1 stat (max 18) or 2 stats if both are under 16:
            </p>

            <div className="levelup-stat-grid">
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
                  <div className="levelup-stat-name">{stat}</div>
                  <div className="levelup-stat-score">
                    {data.score} → {data.score >= 18 ? data.score : data.score + 1}
                    {data.score >= 18 && ' (MAX)'}
                  </div>
                  <div className="levelup-stat-mod">
                    ({data.mod >= 0 ? '+' : ''}
                    {data.mod} →{' '}
                    {Math.floor((Math.min(18, data.score + 1) - 10) / 2) >= 0 ? '+' : ''}
                    {Math.floor((Math.min(18, data.score + 1) - 10) / 2)})
                  </div>
                </button>
              ))}
            </div>

            {levelUpState.selectedStats.length > 0 && (
              <div className="levelup-selected-box">
                Selected: {levelUpState.selectedStats.join(', ')}
              </div>
            )}
          </div>

          {/* Step 2: Advanced Move Selection */}
          <div className="levelup-step">
            <h3 className="levelup-step-title">⚔️ Step 2: Choose Advanced Move</h3>
            <div className="levelup-move-list">
              {Object.entries(advancedMoves)
                .filter(([id]) => !character.selectedMoves.includes(id))
                .map(([id, move]) => (
                  <div key={id} className="levelup-move-wrapper">
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
                      <div className="levelup-move-header">
                        <div className="levelup-move-text">
                          <h4 className="levelup-move-name">{move.name}</h4>
                          <p className="levelup-move-desc">{move.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMoveDetails(showMoveDetails === id ? '' : id);
                          }}
                          className="levelup-details-button"
                        >
                          {showMoveDetails === id ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>

                    {/* Expanded move details */}
                    {showMoveDetails === id && (
                      <div className="levelup-move-details">
                        <p className="levelup-move-expanded">{move.expanded}</p>
                        <div className="levelup-move-examples">
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
              <div className="levelup-selected-box levelup-selected-move">
                Selected: {advancedMoves[levelUpState.selectedMove].name}
              </div>
            )}
          </div>

          {/* Step 3: HP Rolling */}
          <div className="levelup-step">
            <h3 className="levelup-step-title">❤️ Step 3: Roll for Hit Points</h3>
            <div className="levelup-hp-container">
              <button
                onClick={rollHPIncrease}
                className={`levelup-button ${levelUpState.hpIncrease > 0 ? 'levelup-button-rolled' : ''}`}
                disabled={levelUpState.hpIncrease > 0}
              >
                {levelUpState.hpIncrease > 0 ? '✅ HP Rolled' : '🎲 Roll d10 + CON'}
              </button>

              <div className="levelup-hp-text">
                Roll d10 + CON ({character.stats.CON.mod >= 0 ? '+' : ''}
                {character.stats.CON.mod}) for HP increase
                {levelUpState.hpIncrease > 0 && (
                  <div className="levelup-hp-result">Result: +{levelUpState.hpIncrease} HP</div>
                )}
              </div>
            </div>
          </div>

          {/* Summary & Complete Button */}
          <div className={`levelup-summary ${isComplete ? 'complete' : 'incomplete'}`}>
            <h4 className="levelup-summary-title">Level Up Summary</h4>
            <div className="levelup-summary-details">
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

            <div className="levelup-actions">
              <button onClick={onClose} className="levelup-button levelup-button-cancel">
                Cancel
              </button>

              <button
                onClick={completeLevelUp}
                disabled={!isComplete}
                className={`levelup-button levelup-button-complete ${!isComplete ? 'levelup-button-disabled' : ''}`}
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
