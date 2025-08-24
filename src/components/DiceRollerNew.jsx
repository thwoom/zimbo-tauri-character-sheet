import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { css } from '../styled-system/css';
import safeLocalStorage from '../utils/safeLocalStorage.js';
import AidInterfereModal from './AidInterfereModal';
import RollModal from './RollModal';

const DiceRoller = ({
  character,
  rollDice,
  rollResult,
  rollHistory,
  equippedWeaponDamage,
  rollModal,
  rollModalData,
  aidModal,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [presets, setPresets] = useState(() => {
    const saved = safeLocalStorage.getItem('rollPresets');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [presetName, setPresetName] = useState('');
  const [presetFormula, setPresetFormula] = useState('');

  const handleRoll = (expr, label) => {
    setIsRolling(true);
    if (label !== undefined) {
      rollDice(expr, label);
    } else {
      rollDice(expr);
    }
    setTimeout(() => {
      setIsRolling(false);
      setAnimate(true);
    }, 350);
  };

  useEffect(() => {
    if (presets.length > 0) {
      safeLocalStorage.setItem('rollPresets', JSON.stringify(presets));
    } else {
      safeLocalStorage.removeItem('rollPresets');
    }
  }, [presets]);

  const addPreset = () => {
    const name = presetName.trim();
    const formula = presetFormula.trim();
    if (!name || !/^\d*d\d+(?:[+-]\d+)?$/i.test(formula)) return;
    setPresets((prev) => {
      const next = [...prev.filter((p) => p.name !== name), { name, formula }];
      return next.slice(0, 12);
    });
    setPresetName('');
    setPresetFormula('');
  };

  const removePreset = (name) => {
    setPresets((prev) => prev.filter((p) => p.name !== name));
  };

  return (
    <>
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
          🎲 Dice Roller
        </div>
        {/* Stat Check Buttons */}
        <div className={css({ marginBottom: 'lg' })}>
          <h4
            className={css({
              fontSize: 'md',
              fontWeight: 'bold',
              color: 'text',
              marginBottom: 'sm',
            })}
          >
            Stat Checks
          </h4>
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: 'xs',
            })}
          >
            {Object.entries(character.stats).map(([stat, data]) => (
              <button
                key={stat}
                onClick={() => handleRoll(`2d6+${data.mod}`, `${stat} Check`)}
                className={css({
                  padding: 'xs',
                  backgroundColor: 'primary',
                  color: 'background',
                  border: 'none',
                  borderRadius: 'sm',
                  cursor: 'pointer',
                  fontSize: 'xs',
                  fontWeight: 'bold',
                  '&:hover': { opacity: 0.8 },
                })}
                aria-label={`Roll ${stat} Check`}
              >
                {stat} ({data.mod >= 0 ? '+' : ''}
                {data.mod})
              </button>
            ))}
          </div>
        </div>

        {/* Combat Rolls */}
        <div className={css({ marginBottom: 'lg' })}>
          <h4
            className={css({
              fontSize: 'md',
              fontWeight: 'bold',
              color: 'text',
              marginBottom: 'sm',
            })}
          >
            Combat Rolls
          </h4>
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'xs',
            })}
          >
            <button
              onClick={() => rollDice(equippedWeaponDamage, 'Weapon Damage')}
              className={css({
                padding: 'xs',
                backgroundColor: 'secondary',
                color: 'background',
                border: 'none',
                borderRadius: 'sm',
                cursor: 'pointer',
                fontSize: 'xs',
                fontWeight: 'bold',
                '&:hover': { opacity: 0.8 },
              })}
              aria-label={`Roll weapon damage ${equippedWeaponDamage}`}
            >
              Weapon ({equippedWeaponDamage})
            </button>
            <button
              onClick={() => rollDice('d4', 'Upper Hand')}
              className={css({
                padding: 'xs',
                backgroundColor: 'accent',
                color: 'background',
                border: 'none',
                borderRadius: 'sm',
                cursor: 'pointer',
                fontSize: 'xs',
                fontWeight: 'bold',
                '&:hover': { opacity: 0.8 },
              })}
              aria-label="Roll Upper Hand d4"
            >
              Upper Hand (d4)
            </button>
          </div>
        </div>

        {/* Basic Dice */}
        <div className={css({ marginBottom: 'lg' })}>
          <h4
            className={css({
              fontSize: 'md',
              fontWeight: 'bold',
              color: 'text',
              marginBottom: 'sm',
            })}
          >
            Basic Dice
          </h4>
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
              gap: 'xs',
            })}
          >
            {[4, 6, 8, 10, 12, 20].map((sides) => (
              <button
                key={sides}
                onClick={() => handleRoll(`d${sides}`, `d${sides}`)}
                className={css({
                  padding: 'xs',
                  backgroundColor: 'surface',
                  color: 'text',
                  border: '1px solid',
                  borderColor: 'muted',
                  borderRadius: 'sm',
                  cursor: 'pointer',
                  fontSize: 'xs',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'primary',
                    color: 'background',
                    borderColor: 'primary',
                  },
                })}
                aria-label={`Roll d${sides}`}
              >
                d{sides}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Rolls */}
        <div className={css({ marginBottom: 'lg' })}>
          <h4
            className={css({
              fontSize: 'md',
              fontWeight: 'bold',
              color: 'text',
              marginBottom: 'sm',
            })}
          >
            Custom Rolls
          </h4>
          <div
            className={css({
              display: 'flex',
              gap: 'xs',
              marginBottom: 'sm',
            })}
          >
            <input
              type="text"
              placeholder="e.g., 2d6+3"
              className={css({
                flex: 1,
                padding: 'xs',
                backgroundColor: 'surface',
                color: 'text',
                border: '1px solid',
                borderColor: 'muted',
                borderRadius: 'sm',
                fontSize: 'sm',
                '&::placeholder': { color: 'muted' },
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = e.target.value.trim();
                  if (value) handleRoll(value);
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder="e.g., 2d6+3"]');
                if (input && input.value.trim()) {
                  handleRoll(input.value.trim());
                  input.value = '';
                }
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
                fontWeight: 'bold',
                '&:hover': { opacity: 0.8 },
              })}
            >
              Roll
            </button>
          </div>
        </div>

        {/* Presets */}
        {presets.length > 0 && (
          <div className={css({ marginBottom: 'lg' })}>
            <h4
              className={css({
                fontSize: 'md',
                fontWeight: 'bold',
                color: 'text',
                marginBottom: 'sm',
              })}
            >
              Presets
            </h4>
            <div
              className={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 'xs',
              })}
            >
              {presets.map(({ name, formula }) => (
                <div
                  key={name}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'xs',
                  })}
                >
                  <button
                    onClick={() => handleRoll(formula, name)}
                    className={css({
                      flex: 1,
                      padding: 'xs',
                      backgroundColor: 'accent',
                      color: 'background',
                      border: 'none',
                      borderRadius: 'sm',
                      cursor: 'pointer',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                      '&:hover': { opacity: 0.8 },
                    })}
                  >
                    {name}
                  </button>
                  <button
                    onClick={() => removePreset(name)}
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
                    aria-label={`Remove preset ${name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Preset */}
        <div className={css({ marginBottom: 'lg' })}>
          <h4
            className={css({
              fontSize: 'md',
              fontWeight: 'bold',
              color: 'text',
              marginBottom: 'sm',
            })}
          >
            Add Preset
          </h4>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: 'xs',
            })}
          >
            <input
              type="text"
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className={css({
                padding: 'xs',
                backgroundColor: 'surface',
                color: 'text',
                border: '1px solid',
                borderColor: 'muted',
                borderRadius: 'sm',
                fontSize: 'sm',
                '&::placeholder': { color: 'muted' },
              })}
            />
            <input
              type="text"
              placeholder="Dice formula (e.g., 2d6+3)"
              value={presetFormula}
              onChange={(e) => setPresetFormula(e.target.value)}
              className={css({
                padding: 'xs',
                backgroundColor: 'surface',
                color: 'text',
                border: '1px solid',
                borderColor: 'muted',
                borderRadius: 'sm',
                fontSize: 'sm',
                '&::placeholder': { color: 'muted' },
              })}
            />
            <button
              onClick={addPreset}
              className={css({
                padding: 'xs',
                backgroundColor: 'primary',
                color: 'background',
                border: 'none',
                borderRadius: 'sm',
                cursor: 'pointer',
                fontSize: 'sm',
                fontWeight: 'bold',
                '&:hover': { opacity: 0.8 },
              })}
            >
              Add Preset
            </button>
          </div>
        </div>

        {/* Roll Result Display */}
        <div
          className={css({
            padding: 'sm',
            backgroundColor: 'surface',
            border: '1px solid',
            borderColor: 'muted',
            borderRadius: 'sm',
            textAlign: 'center',
            fontSize: 'sm',
            color: 'text',
            fontWeight: 'bold',
          })}
        >
          {rollResult || 'Ready to roll!'}
        </div>
      </div>

      <RollModal isOpen={rollModal.isOpen} onClose={rollModal.close} data={rollModalData} />
      <AidInterfereModal
        isOpen={aidModal.isOpen}
        onConfirm={aidModal.onConfirm}
        onCancel={aidModal.onCancel}
        bonds={(character.bonds || []).map((bond) =>
          typeof bond === 'string' ? bond : bond.name || bond.relationship || 'Unknown Bond',
        )}
      />
    </>
  );
};

DiceRoller.propTypes = {
  character: PropTypes.shape({
    stats: PropTypes.object.isRequired,
  }).isRequired,
  rollDice: PropTypes.func.isRequired,
  rollResult: PropTypes.string.isRequired,
  rollHistory: PropTypes.array.isRequired,
  equippedWeaponDamage: PropTypes.string.isRequired,
  rollModal: PropTypes.object.isRequired,
  rollModalData: PropTypes.object,
  aidModal: PropTypes.object.isRequired,
};

export default DiceRoller;
