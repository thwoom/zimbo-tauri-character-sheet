import PropTypes from 'prop-types';
import { statusEffectTypes } from '../state/character.js';
import useThrottledTimer from '../hooks/useThrottledTimer.js';
import styles from './StatusTray.module.css';

const StatusTray = ({ statusEffects, onEffectClick }) => {
  const now = useThrottledTimer();
  const sorted = [...statusEffects].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return (
    <div className={styles.tray} role="list">
      {sorted.map((effect) => {
        const type = statusEffectTypes[effect.type] || {};
        const Icon = type.icon;
        const remaining = effect.expiresAt
          ? Math.max(0, Math.ceil((effect.expiresAt - now) / 1000))
          : null;
        return (
          <button
            key={effect.id}
            type="button"
            className={styles.chip}
            aria-label={type.name || effect.type}
            onClick={() => onEffectClick(effect.id)}
          >
            {Icon && <Icon className={styles.icon} aria-hidden="true" />}
            {effect.stacks > 1 && <span className={styles.badge}>{effect.stacks}</span>}
            {remaining !== null && <span className={styles.countdown}>{remaining}</span>}
          </button>
        );
      })}
    </div>
  );
};

StatusTray.propTypes = {
  statusEffects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      stacks: PropTypes.number,
      expiresAt: PropTypes.number,
      priority: PropTypes.number,
    }),
  ).isRequired,
  onEffectClick: PropTypes.func.isRequired,
};

export default StatusTray;
