import PropTypes from 'prop-types';
import { advancedMoves as genericAdvanced } from '../data/advancedMoves.js';
import { classes } from '../data/classes/index.js';
import ModalBase from './ui/ModalBase.jsx';

export default function AdvancedAbilitiesModal({ isOpen, onClose, character }) {
  if (!isOpen) return null;

  const classData = classes[character.class] || { advancedMoves: [], startingMoves: [] };
  const selected = new Set(character.selectedMoves || []);

  const ownedAdvanced = [
    // Moves from class data (by id) the character has selected
    ...classData.advancedMoves.filter((m) => selected.has(m.id)),
    // Generic advanced moves table if any selectedMove key matches
    ...Object.entries(genericAdvanced)
      .filter(([id]) => selected.has(id))
      .map(([id, m]) => ({ id, name: m.name, description: m.desc, type: 'advanced' })),
  ];

  const startingOwned = (classData.startingMoves || []).filter((m) => m.type === 'starting');

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Advanced Abilities">
      <div style={{ display: 'grid', gap: 16 }}>
        <section>
          <h3 style={{ margin: 0 }}>Selected Advanced Moves</h3>
          {ownedAdvanced.length === 0 ? (
            <p style={{ color: 'var(--color-muted)' }}>No advanced moves selected yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {ownedAdvanced.map((m) => (
                <li key={m.id} style={{ marginBottom: 8 }}>
                  <strong>{m.name}</strong>
                  <div style={{ color: 'var(--color-muted)' }}>{m.description}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 style={{ margin: 0 }}>Starting Moves</h3>
          {startingOwned.length === 0 ? (
            <p style={{ color: 'var(--color-muted)' }}>No starting moves found for this class.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {startingOwned.map((m) => (
                <li key={m.id} style={{ marginBottom: 8 }}>
                  <strong>{m.name}</strong>
                  <div style={{ color: 'var(--color-muted)' }}>{m.description}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </ModalBase>
  );
}

AdvancedAbilitiesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  character: PropTypes.object.isRequired,
};
