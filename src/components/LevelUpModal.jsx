import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaDice, FaStar } from 'react-icons/fa6';
import { advancedMoves } from '../data/advancedMoves.js';
import { scoreToMod } from '../utils/score.js';
import Message from './Message';
import GlassModal from './ui/GlassModal';

const LevelUpModal = ({
  isOpen = true,
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
  };

  const handleMoveSelection = (moveName) => {
    setLevelUpState((prev) => {
      const alreadySelected = prev.selectedMoves.includes(moveName);
      if (alreadySelected) {
        return { ...prev, selectedMoves: prev.selectedMoves.filter((m) => m !== moveName) };
      }
      return { ...prev, selectedMoves: [...prev.selectedMoves, moveName] };
    });
  };

  const handleComplete = () => {
    // Validate selections
    if (levelUpState.selectedStats.length === 0) {
      setValidationMessage('Please select at least one stat to increase.');
      return;
    }

    if (levelUpState.hpIncrease === 0) {
      setValidationMessage('Please roll for HP increase.');
      return;
    }

    if (levelUpState.selectedMoves.length === 0) {
      setValidationMessage('Please select at least one move.');
      return;
    }

    // Apply level up
    setCharacter((prev) => {
      const newStats = { ...prev.stats };
      levelUpState.selectedStats.forEach((stat) => {
        newStats[stat] = {
          ...newStats[stat],
          score: Math.min(18, newStats[stat].score + 1),
        };
        newStats[stat].mod = scoreToMod(newStats[stat].score);
      });

      const newMoves = [...prev.moves, ...levelUpState.selectedMoves];

      return {
        ...prev,
        level: prev.level + 1,
        stats: newStats,
        moves: newMoves,
        hp: prev.hp + levelUpState.hpIncrease,
        maxHp: prev.maxHp + levelUpState.hpIncrease,
        xp: prev.xp - prev.xpNeeded,
        xpNeeded: Math.floor(prev.xpNeeded * 1.5),
      };
    });

    onClose();
  };

  const getCurrentStep = () => {
    if (levelUpState.selectedStats.length === 0) return 1;
    if (levelUpState.hpIncrease === 0) return 2;
    if (levelUpState.selectedMoves.length === 0) return 3;
    return 4;
  };

  const currentStep = getCurrentStep();

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Level Up to ${levelUpState.newLevel}`}
      icon={<FaStar />}
      variant="success"
      maxWidth="800px"
    >
      <div style={{ padding: '0' }}>
        {/* Progress Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(100, 241, 225, 0.1)',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(100, 241, 225, 0.2)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: currentStep >= 1 ? 'var(--color-neon)' : 'var(--color-neutral)',
            }}
          >
            <div style={{ fontSize: '20px' }}>📊</div>
            <div style={{ fontSize: '12px' }}>Stats</div>
          </div>
          <div
            style={{
              textAlign: 'center',
              color: currentStep >= 2 ? 'var(--color-neon)' : 'var(--color-neutral)',
            }}
          >
            <div style={{ fontSize: '20px' }}>❤️</div>
            <div style={{ fontSize: '12px' }}>HP</div>
          </div>
          <div
            style={{
              textAlign: 'center',
              color: currentStep >= 3 ? 'var(--color-neon)' : 'var(--color-neutral)',
            }}
          >
            <div style={{ fontSize: '20px' }}>⚔️</div>
            <div style={{ fontSize: '12px' }}>Moves</div>
          </div>
          <div
            style={{
              textAlign: 'center',
              color: currentStep >= 4 ? 'var(--color-neon)' : 'var(--color-neutral)',
            }}
          >
            <div style={{ fontSize: '20px' }}>✅</div>
            <div style={{ fontSize: '12px' }}>Complete</div>
          </div>
        </div>

        {validationMessage && (
          <Message type="error" style={{ marginBottom: '1rem' }}>
            {validationMessage}
          </Message>
        )}

        {/* Step 1: Stat Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              color: 'var(--color-neon)',
              marginBottom: '1rem',
              fontSize: '1.2rem',
            }}
          >
            Step 1: Increase Stats
          </h3>
          <p
            style={{
              color: 'var(--color-neutral)',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            Select up to 2 stats to increase by 1 point each (max 18).
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {Object.entries(character.stats).map(([stat, data]) => (
              <button
                key={stat}
                onClick={() => handleStatSelection(stat)}
                style={{
                  padding: '1rem',
                  background: levelUpState.selectedStats.includes(stat)
                    ? 'rgba(100, 241, 225, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    levelUpState.selectedStats.includes(stat)
                      ? 'rgba(100, 241, 225, 0.4)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  borderRadius: 'var(--radius)',
                  color: levelUpState.selectedStats.includes(stat)
                    ? 'var(--color-neon)'
                    : 'var(--color-text)',
                  cursor: data.score >= 18 ? 'not-allowed' : 'pointer',
                  opacity: data.score >= 18 ? 0.5 : 1,
                  transition: 'var(--hud-transition)',
                }}
                disabled={data.score >= 18}
              >
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{stat}</div>
                <div style={{ fontSize: '0.9rem' }}>
                  {data.score} ({data.mod >= 0 ? '+' : ''}
                  {data.mod})
                </div>
                {data.score >= 18 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral)' }}>Max</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: HP Roll */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              color: 'var(--color-neon)',
              marginBottom: '1rem',
              fontSize: '1.2rem',
            }}
          >
            Step 2: Roll for HP
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <button
              onClick={rollHPIncrease}
              disabled={levelUpState.hpIncrease > 0}
              style={{
                padding: '0.75rem 1.5rem',
                background:
                  levelUpState.hpIncrease > 0
                    ? 'rgba(107, 114, 128, 0.2)'
                    : 'rgba(100, 241, 225, 0.2)',
                border: `1px solid ${
                  levelUpState.hpIncrease > 0
                    ? 'rgba(107, 114, 128, 0.3)'
                    : 'rgba(100, 241, 225, 0.3)'
                }`,
                borderRadius: 'var(--radius-sm)',
                color: levelUpState.hpIncrease > 0 ? 'var(--color-neutral)' : 'var(--color-neon)',
                cursor: levelUpState.hpIncrease > 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'var(--hud-transition)',
              }}
            >
              <FaDice />
              Roll d10 + CON
            </button>
            {levelUpState.hpIncrease > 0 && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(74, 179, 129, 0.2)',
                  border: '1px solid rgba(74, 179, 129, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-success)',
                  fontWeight: 'bold',
                }}
              >
                +{levelUpState.hpIncrease} HP
              </div>
            )}
          </div>
          <p
            style={{
              color: 'var(--color-neutral)',
              fontSize: '0.9rem',
              margin: 0,
            }}
          >
            Current HP: {character.hp}/{character.maxHp} → New Max:{' '}
            {character.maxHp + levelUpState.hpIncrease}
          </p>
        </div>

        {/* Step 3: Move Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              color: 'var(--color-neon)',
              marginBottom: '1rem',
              fontSize: '1.2rem',
            }}
          >
            Step 3: Choose Moves
          </h3>
          <p
            style={{
              color: 'var(--color-neutral)',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            Select moves from your class or any class. Click a move to see details.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {advancedMoves.map((move) => (
              <div key={move.name}>
                <button
                  onClick={() => setShowMoveDetails(showMoveDetails === move.name ? '' : move.name)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: levelUpState.selectedMoves.includes(move.name)
                      ? 'rgba(100, 241, 225, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      levelUpState.selectedMoves.includes(move.name)
                        ? 'rgba(100, 241, 225, 0.4)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    borderRadius: 'var(--radius)',
                    color: levelUpState.selectedMoves.includes(move.name)
                      ? 'var(--color-neon)'
                      : 'var(--color-text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--hud-transition)',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{move.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral)' }}>
                    {move.class}
                  </div>
                </button>
                {showMoveDetails === move.name && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '1rem',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Description:</strong> {move.description}
                    </div>
                    {move.trigger && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Trigger:</strong> {move.trigger}
                      </div>
                    )}
                    <button
                      onClick={() => handleMoveSelection(move.name)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: levelUpState.selectedMoves.includes(move.name)
                          ? 'rgba(74, 179, 129, 0.2)'
                          : 'rgba(100, 241, 225, 0.2)',
                        border: `1px solid ${
                          levelUpState.selectedMoves.includes(move.name)
                            ? 'rgba(74, 179, 129, 0.3)'
                            : 'rgba(100, 241, 225, 0.3)'
                        }`,
                        borderRadius: 'var(--radius-sm)',
                        color: levelUpState.selectedMoves.includes(move.name)
                          ? 'var(--color-success)'
                          : 'var(--color-neon)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'var(--hud-transition)',
                      }}
                    >
                      {levelUpState.selectedMoves.includes(move.name) ? 'Selected' : 'Select Move'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Complete Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
          }}
        >
          <button
            onClick={handleComplete}
            disabled={currentStep < 4}
            style={{
              padding: '1rem 2rem',
              background: currentStep >= 4 ? 'rgba(74, 179, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
              border: `1px solid ${
                currentStep >= 4 ? 'rgba(74, 179, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)'
              }`,
              borderRadius: 'var(--radius)',
              color: currentStep >= 4 ? 'var(--color-success)' : 'var(--color-neutral)',
              cursor: currentStep >= 4 ? 'pointer' : 'not-allowed',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'var(--hud-transition)',
            }}
          >
            <FaStar />
            Complete Level Up
          </button>
        </div>
      </div>
    </GlassModal>
  );
};

LevelUpModal.propTypes = {
  isOpen: PropTypes.bool,
  character: PropTypes.object.isRequired,
  setCharacter: PropTypes.func.isRequired,
  levelUpState: PropTypes.object.isRequired,
  setLevelUpState: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  rollDie: PropTypes.func.isRequired,
  setRollResult: PropTypes.func.isRequired,
};

export default LevelUpModal;
