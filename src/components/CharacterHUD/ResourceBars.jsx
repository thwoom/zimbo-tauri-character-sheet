import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ResourceBars.module.css';

export default function ResourceBars({ primary, secondary, shield }) {
  const [showPercent, setShowPercent] = useState(false);

  const prevPrimary = useRef(primary.current);
  const prevSecondary = useRef(secondary.current);

  const primaryPercent = Math.min(100, (primary.current / primary.max) * 100);
  const secondaryPercent = Math.min(100, (secondary.current / secondary.max) * 100);
  const shieldPercent = shield ? Math.min(100, (shield.current / primary.max) * 100) : 0;

  const [primaryChip, setPrimaryChip] = useState(primaryPercent);
  const [secondaryChip, setSecondaryChip] = useState(secondaryPercent);

  useEffect(() => {
    if (primary.current < prevPrimary.current) {
      setPrimaryChip((prevPrimary.current / primary.max) * 100);
      requestAnimationFrame(() => setPrimaryChip(primaryPercent));
    } else if (primary.current > prevPrimary.current) {
      setPrimaryChip(primaryPercent);
      requestAnimationFrame(() => setPrimaryChip((prevPrimary.current / primary.max) * 100));
    } else {
      setPrimaryChip(primaryPercent);
    }
    prevPrimary.current = primary.current;
  }, [primary.current, primary.max, primaryPercent]);

  useEffect(() => {
    if (secondary.current < prevSecondary.current) {
      setSecondaryChip((prevSecondary.current / secondary.max) * 100);
      requestAnimationFrame(() => setSecondaryChip(secondaryPercent));
    } else if (secondary.current > prevSecondary.current) {
      setSecondaryChip(secondaryPercent);
      requestAnimationFrame(() => setSecondaryChip((prevSecondary.current / secondary.max) * 100));
    } else {
      setSecondaryChip(secondaryPercent);
    }
    prevSecondary.current = secondary.current;
  }, [secondary.current, secondary.max, secondaryPercent]);

  const renderBar = (percent, chip, prev, current, max, type, includeShield) => (
    <div
      className={styles.barWrapper}
      onMouseEnter={() => setShowPercent(true)}
      onMouseLeave={() => setShowPercent(false)}
      onFocus={() => setShowPercent(true)}
      onBlur={() => setShowPercent(false)}
    >
      <div
        className={`${styles.bar} ${styles[type]}`}
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
      />
      <div
        className={`${styles.chip} ${current < prev.current ? styles.damage : styles.heal}`}
        style={{ width: `${chip}%` }}
      />
      {includeShield && shield?.current > 0 && (
        <div
          className={styles.shield}
          style={{ width: `${Math.min(percent + shieldPercent, 100)}%` }}
          data-testid="shield-bar"
        />
      )}
      <span className={styles.label}>
        {showPercent ? `${Math.round(percent)}%` : `${current}/${max}`}
      </span>
    </div>
  );

  return (
    <div className={styles.container}>
      {renderBar(
        primaryPercent,
        primaryChip,
        prevPrimary,
        primary.current,
        primary.max,
        'primary',
        true,
      )}
      {renderBar(
        secondaryPercent,
        secondaryChip,
        prevSecondary,
        secondary.current,
        secondary.max,
        'secondary',
        false,
      )}
    </div>
  );
}

ResourceBars.propTypes = {
  primary: PropTypes.shape({
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }).isRequired,
  secondary: PropTypes.shape({
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }).isRequired,
  shield: PropTypes.shape({
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),
};

ResourceBars.defaultProps = {
  shield: null,
};
