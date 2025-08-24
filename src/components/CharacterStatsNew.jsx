import PropTypes from 'prop-types';
import { css } from '../styled-system/css';
import { resourceColors } from '../styles/colorMap.js';

const CharacterStats = ({
  character,
  setCharacter,
  saveToHistory,
  totalArmor,
  setShowLevelUpModal,
  setRollResult,
  setSessionNotes = () => {},
  clearRollHistory = () => {},
}) => {
  return (
    <div
      className={css({
        background: 'rgba(2, 30, 38, 0.8)',
        border: '1px solid rgba(100, 241, 225, 0.3)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      })}
    >
      <div
        className={css({
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: '#64f1e1',
          marginBottom: '1rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(100, 241, 225, 0.2)',
          paddingBottom: '0.5rem',
        })}
      >
        ⚡ Stats & Health
      </div>
      {/* Stats Grid */}
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: 'sm',
          marginBottom: 'md',
        })}
      >
        {Object.entries(character.stats).map(([stat, data]) => (
          <div
            key={stat}
            className={css({
              textAlign: 'center',
              padding: 'xs',
              border: '1px solid',
              borderColor: 'muted',
              borderRadius: 'sm',
            })}
          >
            <div
              className={css({
                fontSize: 'sm',
                fontWeight: 'bold',
                color: 'text',
                marginBottom: 'xs',
              })}
            >
              {stat}
            </div>
            <div
              className={css({
                fontSize: 'lg',
                color: 'primary',
              })}
            >
              {data.score} ({data.mod >= 0 ? '+' : ''}
              {data.mod})
            </div>
          </div>
        ))}
      </div>

      {/* HP Bar */}
      <div className={css({ marginBottom: 'md' })}>
        <div
          className={css({
            width: '100%',
            height: '20px',
            backgroundColor: 'surface',
            border: '1px solid',
            borderColor: 'muted',
            borderRadius: 'sm',
            overflow: 'hidden',
            marginBottom: 'xs',
          })}
        >
          <div
            className={css({
              height: '100%',
              backgroundColor: 'secondary',
              transition: 'width 0.3s ease',
            })}
            style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
          />
        </div>
        <div
          className={css({
            textAlign: 'center',
            fontSize: 'sm',
            color: 'text',
          })}
        >
          HP: {character.hp}/{character.maxHp} | Armor: {totalArmor}
        </div>
      </div>

      {/* HP Controls */}
      <div
        className={css({
          display: 'flex',
          gap: 'sm',
          marginBottom: 'md',
          justifyContent: 'center',
        })}
      >
        <button
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter((prev) => ({
              ...prev,
              hp: Math.min(prev.maxHp, prev.hp + 1),
            }));
          }}
          className={css({
            padding: 'xs',
            paddingX: 'sm',
            backgroundColor: 'primary',
            color: 'background',
            border: 'none',
            borderRadius: 'sm',
            cursor: 'pointer',
            fontSize: 'sm',
            '&:hover': { opacity: 0.8 },
          })}
        >
          +1 HP
        </button>
        <button
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter((prev) => ({
              ...prev,
              hp: Math.max(0, prev.hp - 1),
            }));
          }}
          className={css({
            padding: 'xs',
            paddingX: 'sm',
            backgroundColor: 'secondary',
            color: 'background',
            border: 'none',
            borderRadius: 'sm',
            cursor: 'pointer',
            fontSize: 'sm',
            '&:hover': { opacity: 0.8 },
          })}
        >
          -1 HP
        </button>
      </div>

      {/* XP Bar */}
      <div className={css({ marginBottom: 'md' })}>
        <div
          className={css({
            width: '100%',
            height: '20px',
            backgroundColor: 'surface',
            border: '1px solid',
            borderColor: 'muted',
            borderRadius: 'sm',
            overflow: 'hidden',
            marginBottom: 'xs',
          })}
        >
          <div
            className={css({
              height: '100%',
              backgroundColor: 'accent',
              transition: 'width 0.3s ease',
            })}
            style={{ width: `${(character.xp / character.xpNeeded) * 100}%` }}
          />
        </div>
        <div
          className={css({
            textAlign: 'center',
            fontSize: 'sm',
            color: 'text',
          })}
          data-testid="xp-display"
        >
          XP: {character.xp}/{character.xpNeeded} (Level {character.level})
        </div>
      </div>

      {/* XP Controls */}
      <div
        className={css({
          display: 'flex',
          gap: 'sm',
          marginBottom: 'md',
          justifyContent: 'center',
        })}
      >
        <button
          onClick={() =>
            setCharacter((prev) => ({
              ...prev,
              xp: prev.xp + 1,
              xpNeeded: prev.level + 7,
            }))
          }
          className={css({
            padding: 'xs',
            paddingX: 'sm',
            backgroundColor: 'primary',
            color: 'background',
            border: 'none',
            borderRadius: 'sm',
            cursor: 'pointer',
            fontSize: 'sm',
            '&:hover': { opacity: 0.8 },
          })}
          data-testid="increment-xp"
        >
          +1 XP
        </button>
        <button
          onClick={() =>
            setCharacter((prev) => ({
              ...prev,
              xp: Math.max(0, prev.xp - 1),
              xpNeeded: prev.level + 7,
            }))
          }
          className={css({
            padding: 'xs',
            paddingX: 'sm',
            backgroundColor: 'secondary',
            color: 'background',
            border: 'none',
            borderRadius: 'sm',
            cursor: 'pointer',
            fontSize: 'sm',
            '&:hover': { opacity: 0.8 },
          })}
        >
          -1 XP
        </button>
      </div>

      {/* Level Up Buttons */}
      {import.meta.env.DEV && (
        <button
          onClick={() => setShowLevelUpModal(true)}
          className={css({
            width: '100%',
            padding: 'sm',
            backgroundColor: 'accent',
            color: 'background',
            border: 'none',
            borderRadius: 'sm',
            cursor: 'pointer',
            fontSize: 'sm',
            marginBottom: 'sm',
            '&:hover': { opacity: 0.8 },
          })}
        >
          Open Level Up Test Modal
        </button>
      )}
      {character.xp >= character.xpNeeded && (
        <button
          onClick={() => setShowLevelUpModal(true)}
          className={css({
            width: '100%',
            padding: 'sm',
            backgroundColor: 'accent',
            color: 'background',
            border: 'none',
            borderRadius: 'sm',
            cursor: 'pointer',
            fontSize: 'sm',
            marginBottom: 'md',
            fontWeight: 'bold',
            '&:hover': { opacity: 0.8 },
          })}
        >
          🎉 LEVEL UP AVAILABLE!
        </button>
      )}

      {/* Chrono-Retcon */}
      <div className={css({ marginBottom: 'md' })}>
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'sm',
            marginBottom: 'sm',
          })}
        >
          <button
            aria-label="Decrease Chrono-Retcon"
            onClick={() =>
              setCharacter((prev) => ({
                ...prev,
                resources: {
                  ...prev.resources,
                  chronoUses: Math.max(0, prev.resources.chronoUses - 1),
                },
              }))
            }
            className={css({
              padding: 'xs',
              backgroundColor: 'secondary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'sm',
              '&:hover': { opacity: 0.8 },
            })}
          >
            -1
          </button>
          <span className={css({ color: 'text', fontSize: 'sm' })}>
            Chrono-Retcon Uses: {character.resources.chronoUses}
          </span>
          <button
            aria-label="Increase Chrono-Retcon"
            onClick={() =>
              setCharacter((prev) => ({
                ...prev,
                resources: {
                  ...prev.resources,
                  chronoUses: Math.min(2, prev.resources.chronoUses + 1),
                },
              }))
            }
            className={css({
              padding: 'xs',
              backgroundColor: 'primary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'sm',
              '&:hover': { opacity: 0.8 },
            })}
          >
            +1
          </button>
        </div>
        <button
          onClick={() => {
            if (character.resources.chronoUses > 0) {
              setCharacter((prev) => ({
                ...prev,
                resources: {
                  ...prev.resources,
                  chronoUses: Math.max(0, prev.resources.chronoUses - 1),
                },
              }));
              setRollResult('⏰ Chrono-Retcon activated - rewrite any recent action!');
              setTimeout(() => setRollResult('Ready to roll!'), 3000);
            } else {
              setRollResult('❌ No uses remaining!');
              setTimeout(() => setRollResult('Ready to roll!'), 2000);
            }
          }}
          disabled={character.resources.chronoUses === 0}
          className={css({
            width: '100%',
            padding: 'sm',
            backgroundColor: character.resources.chronoUses > 0 ? 'primary' : 'muted',
            color: 'background',
            border: 'none',
            borderRadius: 'sm',
            cursor: character.resources.chronoUses > 0 ? 'pointer' : 'not-allowed',
            fontSize: 'sm',
            opacity: character.resources.chronoUses > 0 ? 1 : 0.5,
            '&:hover': character.resources.chronoUses > 0 ? { opacity: 0.8 } : {},
          })}
        >
          ⏰ Use Chrono-Retcon
        </button>
      </div>

      {/* Resources */}
      {[
        { key: 'coin', label: 'Coin', max: 999 },
        { key: 'paradoxPoints', label: 'Paradox Points', max: 3 },
        { key: 'bandages', label: 'Bandages', max: 3 },
        { key: 'rations', label: 'Rations', max: 5 },
        { key: 'advGear', label: 'Adventuring Gear', max: 5 },
      ].map(({ key, label, max }) => (
        <div
          key={key}
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'xs',
            borderBottom: '1px solid',
            borderColor: 'muted',
          })}
        >
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: 'sm',
            })}
          >
            <span className={css({ color: 'text', fontSize: 'sm' })}>{label}:</span>
            <span
              className={css({
                color: resourceColors[key],
                fontSize: 'sm',
                fontWeight: 'bold',
              })}
            >
              {character.resources[key]}/{max}
            </span>
          </div>
          <div
            className={css({
              display: 'flex',
              gap: 'xs',
            })}
          >
            <button
              onClick={() =>
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    ...prev.resources,
                    [key]: Math.max(0, prev.resources[key] - 1),
                  },
                }))
              }
              className={css({
                padding: 'xs',
                backgroundColor: 'secondary',
                color: 'background',
                border: 'none',
                borderRadius: 'sm',
                cursor: 'pointer',
                fontSize: 'xs',
                '&:hover': { opacity: 0.8 },
              })}
            >
              -1
            </button>
            <button
              onClick={() =>
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    ...prev.resources,
                    [key]: Math.min(max, prev.resources[key] + 1),
                  },
                }))
              }
              className={css({
                padding: 'xs',
                backgroundColor: 'primary',
                color: 'background',
                border: 'none',
                borderRadius: 'sm',
                cursor: 'pointer',
                fontSize: 'xs',
                '&:hover': { opacity: 0.8 },
              })}
            >
              +1
            </button>
          </div>
        </div>
      ))}

      {/* Reality Warning */}
      {character.resources.paradoxPoints >= 3 && (
        <div
          className={css({
            padding: 'sm',
            backgroundColor: 'secondary',
            color: 'background',
            textAlign: 'center',
            borderRadius: 'sm',
            marginTop: 'sm',
            fontWeight: 'bold',
          })}
        >
          ⚠️ REALITY UNSTABLE! ⚠️
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={() => {
          setCharacter((prev) => ({
            ...prev,
            resources: {
              chronoUses: 2,
              paradoxPoints: 0,
              bandages: 3,
              rations: 5,
              advGear: 5,
            },
          }));
          setSessionNotes('');
          clearRollHistory();
          setRollResult('🔄 All resources restored!');
        }}
        className={css({
          width: '100%',
          padding: 'sm',
          backgroundColor: 'accent',
          color: 'background',
          border: 'none',
          borderRadius: 'sm',
          cursor: 'pointer',
          fontSize: 'sm',
          marginTop: 'md',
          '&:hover': { opacity: 0.8 },
        })}
      >
        🔄 Reset All Resources
      </button>
    </div>
  );
};

CharacterStats.propTypes = {
  character: PropTypes.shape({
    stats: PropTypes.object.isRequired,
    hp: PropTypes.number.isRequired,
    maxHp: PropTypes.number.isRequired,
    xp: PropTypes.number.isRequired,
    xpNeeded: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    resources: PropTypes.object.isRequired,
  }).isRequired,
  setCharacter: PropTypes.func.isRequired,
  saveToHistory: PropTypes.func.isRequired,
  totalArmor: PropTypes.number.isRequired,
  setShowLevelUpModal: PropTypes.func.isRequired,
  setRollResult: PropTypes.func.isRequired,
  setSessionNotes: PropTypes.func,
  clearRollHistory: PropTypes.func,
};

export default CharacterStats;
