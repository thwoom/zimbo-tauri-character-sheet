import PropTypes from 'prop-types';
import { FaBoxOpen, FaClock, FaGem, FaMeteor, FaShield } from 'react-icons/fa6';
import glassStyles from '../styles/glassmorphic.module.css';
import ModalBase from './ui/ModalBase.jsx';

const iconForType = (type) => {
  switch (type) {
    case 'weapon':
      return <FaMeteor />;
    case 'armor':
      return <FaShield />;
    case 'artifact':
      return <FaGem />;
    default:
      return <FaBoxOpen />;
  }
};

export default function ItemDetailsModal({ isOpen, onClose, item, character, setCharacter }) {
  if (!isOpen || !item) return null;

  const adjustResource = (key, delta, min = 0, max = Number.POSITIVE_INFINITY) => {
    setCharacter((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        [key]: Math.max(min, Math.min(max, (prev.resources?.[key] || 0) + delta)),
      },
    }));
  };

  // Future-proof: items can declare resourceLinks like [{ key: 'paradoxPoints', label: 'Paradox Points', max: 3 }]
  const resourceLinks =
    item.resourceLinks ||
    (item.name === 'Ring of Smooshed Chronologies'
      ? [
          { key: 'paradoxPoints', label: 'Paradox Points', max: 3 },
          { key: 'chronoUses', label: 'Chrono-Retcon Uses', max: 2 },
        ]
      : []);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{iconForType(item.type)}</span>
          <strong>{item.name}</strong>
          {item.type && <span style={{ opacity: 0.7, fontSize: 12 }}>({item.type})</span>}
        </div>
      }
    >
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        {item.description && (
          <div className={glassStyles.glassCard}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Description</div>
            <div style={{ opacity: 0.9 }}>{item.description}</div>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className={glassStyles.glassCard}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Tags</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {item.tags.map((t) => (
                <span key={t} className={glassStyles.glassBadge}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {resourceLinks.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FaClock className={glassStyles.glassTextMuted} />
              <strong>Item Resources</strong>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {resourceLinks.map(({ key, label, max }) => {
                const current = character.resources?.[key] || 0;
                const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
                return (
                  <div key={key} className={glassStyles.glassCard}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{label}</div>
                      <div className={glassStyles.glassTextMuted}>
                        {current}/{max}
                      </div>
                    </div>
                    <div
                      className={glassStyles.glassProgress}
                      aria-valuenow={current}
                      aria-valuemin={0}
                      aria-valuemax={max}
                      style={{ height: 10 }}
                    >
                      <div className={glassStyles.glassProgressFill} style={{ width: `${pct}%` }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        className={`${glassStyles.glassButton} ${glassStyles.glassButtonDanger} ${glassStyles.glassButtonSmall}`}
                        onClick={() => adjustResource(key, -1, 0, max)}
                        disabled={current <= 0}
                      >
                        -1
                      </button>
                      <button
                        className={`${glassStyles.glassButton} ${glassStyles.glassButtonSuccess} ${glassStyles.glassButtonSmall}`}
                        onClick={() => adjustResource(key, +1, 0, max)}
                        disabled={current >= max}
                      >
                        +1
                      </button>
                      {key === 'chronoUses' && (
                        <button
                          className={`${glassStyles.glassButton} ${glassStyles.glassButtonSecondary} ${glassStyles.glassButtonSmall}`}
                          onClick={() => {
                            const event = new CustomEvent('open-item-abilities');
                            window.dispatchEvent(event);
                            onClose?.();
                          }}
                        >
                          Open Abilities…
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </ModalBase>
  );
}

ItemDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  character: PropTypes.object.isRequired,
  setCharacter: PropTypes.func.isRequired,
};
