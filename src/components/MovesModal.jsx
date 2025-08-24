import PropTypes from 'prop-types';
import { classes } from '../data/classes/index.js';
import glassStyles from '../styles/glassmorphic.module.css';
import ModalBase from './ui/ModalBase.jsx';

export default function MovesModal({ isOpen, onClose, character }) {
  if (!isOpen) return null;
  const classData = classes[character.class] || { startingMoves: [], advancedMoves: [] };
  const selected = new Set(character.selectedMoves || []);

  const starting = classData.startingMoves || [];
  const advancedOwned = (classData.advancedMoves || []).filter((m) => selected.has(m.id));

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      header={<strong>{character.class || 'Class'} Moves</strong>}
    >
      <div style={{ padding: 16, display: 'grid', gap: 16 }}>
        <section>
          <h3 style={{ margin: 0 }}>Starting Moves</h3>
          {starting.length === 0 ? (
            <div className={`${glassStyles.glassStatus} ${glassStyles.glassStatusWarning}`}>
              None listed for this class.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {starting.map((m) => (
                <div key={m.id || m.name} className={glassStyles.glassCard}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{m.name}</div>
                  <div className={glassStyles.glassTextMuted}>{m.description}</div>
                  {m.choices && m.choices.length > 0 && (
                    <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                      {m.choices.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className={glassStyles.glassDivider} />

        <section>
          <h3 style={{ margin: 0 }}>Advanced Moves</h3>
          {advancedOwned.length === 0 ? (
            <div className={`${glassStyles.glassStatus} ${glassStyles.glassStatusWarning}`}>
              You have not selected any advanced moves yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {advancedOwned.map((m) => (
                <div key={m.id} className={glassStyles.glassCard}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{m.name}</div>
                  <div className={glassStyles.glassTextMuted}>{m.description}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ModalBase>
  );
}

MovesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  character: PropTypes.object.isRequired,
};
