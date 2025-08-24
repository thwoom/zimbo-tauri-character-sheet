import PropTypes from 'prop-types';
import { FaClock, FaSkull, FaTriangleExclamation } from 'react-icons/fa6';
import styles from './StatusEffectTimer.module.css';

const StatusEffectTimer = ({ effect, timerStatus, onAdjust }) => {
  if (!timerStatus) return null;

  const { minutes, seconds, status, count } = timerStatus;

  const getStatusClass = () => {
    switch (status) {
      case 'critical':
        return styles.critical;
      case 'warning':
        return styles.warning;
      default:
        return styles.normal;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'critical':
        return <FaSkull className={styles.icon} />;
      case 'warning':
        return <FaTriangleExclamation className={styles.icon} />;
      default:
        return <FaClock className={styles.icon} />;
    }
  };

  const formatTime = () => {
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const handleAdjust = (adjustment) => {
    if (onAdjust) {
      onAdjust(effect, adjustment);
    }
  };

  return (
    <div className={`${styles.timer} ${getStatusClass()}`}>
      <div className={styles.header}>
        {getStatusIcon()}
        <span className={styles.effectName}>{effect}</span>
        {count > 1 && <span className={styles.count}>({count})</span>}
      </div>

      <div className={styles.timeDisplay}>
        <span className={styles.time}>{formatTime()}</span>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.adjustButton}
          onClick={() => handleAdjust(1)}
          title="Add 1 minute"
          aria-label={`Add 1 minute to ${effect} timer`}
        >
          +1m
        </button>
        <button
          type="button"
          className={styles.adjustButton}
          onClick={() => handleAdjust(-1)}
          title="Remove 1 minute"
          aria-label={`Remove 1 minute from ${effect} timer`}
        >
          -1m
        </button>
      </div>
    </div>
  );
};

StatusEffectTimer.propTypes = {
  effect: PropTypes.string.isRequired,
  timerStatus: PropTypes.shape({
    remaining: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['normal', 'warning', 'critical']).isRequired,
    count: PropTypes.number.isRequired,
  }),
  onAdjust: PropTypes.func,
};

export default StatusEffectTimer;
