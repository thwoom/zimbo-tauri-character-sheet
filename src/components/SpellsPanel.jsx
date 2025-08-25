import PropTypes from 'prop-types';
import React from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import Panel from './ui/Panel';

function SpellsPanel({ character, setCharacter, saveToHistory }) {
  const togglePrepared = (id) => {
    saveToHistory('Spell Preparation');
    setCharacter((prev) => ({
      ...prev,
      spells: prev.spells.map((s) => (s.id === id ? { ...s, prepared: !s.prepared } : s)),
    }));
  };

  const castSpell = (id) => {
    saveToHistory('Cast Spell');
    setCharacter((prev) => ({
      ...prev,
      spells: prev.spells.map((s) => (s.id === id ? { ...s, expended: true } : s)),
    }));
  };

  return (
    <Panel>
      <h3
        style={{
          color: 'var(--color-accent)',
          marginBottom: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          fontSize: '1.125rem',
        }}
      >
        <FaWandMagicSparkles /> Spells
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {character.spells.map((spell) => (
          <li
            key={spell.id}
            style={{
              borderLeft: '4px solid var(--color-accent)',
              padding: 'var(--space-sm)',
              marginBottom: 'var(--space-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={spell.prepared}
                onChange={() => togglePrepared(spell.id)}
              />{' '}
              {spell.name}
            </label>
            <button
              onClick={() => castSpell(spell.id)}
              disabled={!spell.prepared || spell.expended}
            >
              {spell.expended ? 'Expended' : 'Cast'}
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

SpellsPanel.propTypes = {
  character: PropTypes.shape({
    spells: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        prepared: PropTypes.bool.isRequired,
        expended: PropTypes.bool.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  setCharacter: PropTypes.func.isRequired,
  saveToHistory: PropTypes.func.isRequired,
};

export default SpellsPanel;
