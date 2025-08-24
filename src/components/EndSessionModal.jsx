import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaFlagCheckered } from 'react-icons/fa6';
import { useCharacter } from '../state/CharacterContext';
import GlassModal from './ui/GlassModal';

const defaultAnswers = { q1: false, q2: false, q3: false, alignment: false };

export default function EndSessionModal({ isOpen, onClose }) {
  const { character, setCharacter } = useCharacter();
  const [answers, setAnswers] = useState(defaultAnswers);
  const [resolvedBonds, setResolvedBonds] = useState([]);
  const [replacementBonds, setReplacementBonds] = useState({});
  const [recap, setRecap] = useState('');
  const [inventoryChanges, setInventoryChanges] = useState({});
  const [clearedStatus, setClearedStatus] = useState([]);
  const [clearedDebilities, setClearedDebilities] = useState([]);
  const [shareRecap, setShareRecap] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [error, setError] = useState('');

  const toggleAnswer = (key) => {
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBond = (index) => {
    setResolvedBonds((prev) => {
      if (prev.includes(index)) {
        setReplacementBonds((r) => {
          const rest = { ...r };
          delete rest[index];
          return rest;
        });
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleBondTextChange = (index, text) => {
    setReplacementBonds((prev) => ({ ...prev, [index]: text }));
  };

  const handleInventoryChange = (id, value) => {
    setInventoryChanges((prev) => ({ ...prev, [id]: value }));
  };

  const toggleStatus = (effect) => {
    setClearedStatus((prev) =>
      prev.includes(effect) ? prev.filter((e) => e !== effect) : [...prev, effect],
    );
  };

  const toggleDebility = (debility) => {
    setClearedDebilities((prev) =>
      prev.includes(debility) ? prev.filter((d) => d !== debility) : [...prev, debility],
    );
  };

  const totalXP = Object.values(answers).filter(Boolean).length + resolvedBonds.length;

  const handleEnd = async () => {
    setSaveError(false);
    const xpGained = totalXP;
    const newXp = character.xp + xpGained;
    const timestamp = new Date().toISOString();

    setCharacter((prev) => {
      const newXp = prev.xp + xpGained;
      const remainingBonds = prev.bonds.filter((_, idx) => !resolvedBonds.includes(idx));
      const newBonds = resolvedBonds
        .map((idx) => {
          const text = replacementBonds[idx]?.trim();
          if (!text) return null;
          return {
            name: prev.bonds[idx].name,
            relationship: text,
            resolved: false,
          };
        })
        .filter(Boolean);

      const updated = {
        ...prev,
        xp: newXp,
        bonds: [...remainingBonds, ...newBonds],
        lastSessionEnd: timestamp,
        sessionRecap: recap,
      };
      if (shareRecap) {
        updated.sessionRecapPublic = recap;
      }
      return updated;
    });

    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="End of Session"
      icon={<FaFlagCheckered />}
      variant="success"
      maxWidth="800px"
    >
      <div style={{ padding: '0' }}>
        <div
          style={{
            padding: '1rem',
            background: 'rgba(74, 179, 129, 0.1)',
            border: '1px solid rgba(74, 179, 129, 0.2)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#4ab381', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Session Summary & XP Gain
          </div>
          <div style={{ color: 'var(--color-neutral)', fontSize: '0.9rem' }}>
            Total XP to gain: {totalXP}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius)',
              transition: 'var(--hud-transition)',
            }}
          >
            <h3
              style={{
                color: '#64f1e1',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Session Questions
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={answers.q1}
                  onChange={() => toggleAnswer('q1')}
                  style={{ margin: 0 }}
                />
                <span style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  Did we learn something new and important about the world?
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={answers.q2}
                  onChange={() => toggleAnswer('q2')}
                  style={{ margin: 0 }}
                />
                <span style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  Did we overcome a notable monster or enemy?
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={answers.q3}
                  onChange={() => toggleAnswer('q3')}
                  style={{ margin: 0 }}
                />
                <span style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  Did we loot a memorable treasure?
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={answers.alignment}
                  onChange={() => toggleAnswer('alignment')}
                  style={{ margin: 0 }}
                />
                <span style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  Did you fulfill your alignment/drive?
                </span>
              </label>
            </div>
          </div>

          {character.bonds.length > 0 && (
            <div
              style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius)',
                transition: 'var(--hud-transition)',
              }}
            >
              <h3
                style={{
                  color: '#64f1e1',
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                Bonds Resolved
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {character.bonds.map((bond, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        marginBottom: resolvedBonds.includes(idx) ? '0.5rem' : '0',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={resolvedBonds.includes(idx)}
                        onChange={() => toggleBond(idx)}
                        style={{ margin: 0 }}
                      />
                      <span style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                        {bond.name}: {bond.relationship}
                      </span>
                    </label>
                    {resolvedBonds.includes(idx) && (
                      <input
                        type="text"
                        placeholder="New bond text"
                        value={replacementBonds[idx] || ''}
                        onChange={(e) => handleBondTextChange(idx, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          color: '#d0d7e2',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius)',
              transition: 'var(--hud-transition)',
            }}
          >
            <h3
              style={{
                color: '#64f1e1',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Session Recap
            </h3>
            <textarea
              value={recap}
              onChange={(e) => setRecap(e.target.value)}
              placeholder="What happened in this session?"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#d0d7e2',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
                minHeight: '100px',
              }}
            />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              <input
                type="checkbox"
                checked={shareRecap}
                onChange={(e) => setShareRecap(e.target.checked)}
                style={{ margin: 0 }}
              />
              <span style={{ color: 'var(--color-neutral)', fontSize: '0.8rem' }}>
                Share this recap publicly
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.2)',
              borderRadius: '6px',
              color: '#dc3545',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleEnd}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(74, 179, 129, 0.2)',
              border: '1px solid rgba(74, 179, 129, 0.3)',
              borderRadius: '6px',
              color: '#4ab381',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
          >
            End Session (+{totalXP} XP)
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </GlassModal>
  );
}

EndSessionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
