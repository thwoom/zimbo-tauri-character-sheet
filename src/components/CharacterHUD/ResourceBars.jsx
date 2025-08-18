import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export default function ResourceBars({ primary, secondary, shield }) {
  const [showPercent, setShowPercent] = useState(false);

  const prevPrimary = useRef(primary.current);
  const prevSecondary = useRef(secondary?.current ?? 0);

  const primaryPercent = Math.min(100, (primary.current / primary.max) * 100);
  const secondaryPercent = secondary ? Math.min(100, (secondary.current / secondary.max) * 100) : 0;
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
    if (!secondary) return;

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
  }, [secondary?.current, secondary?.max, secondaryPercent, secondary]);

  const renderBar = (percent, chip, prev, current, max, type, includeShield) => (
    <div
      className="relative w-full h-4 bg-muted rounded overflow-hidden"
      onMouseEnter={() => setShowPercent(true)}
      onMouseLeave={() => setShowPercent(false)}
      onFocus={() => setShowPercent(true)}
      onBlur={() => setShowPercent(false)}
    >
      <div
        className={`h-full transition-all motion-reduce:transition-none ${
          type === 'primary'
            ? 'bg-[linear-gradient(90deg,var(--color-danger),var(--color-warning))]'
            : 'bg-[linear-gradient(90deg,var(--accent),var(--color-accent-dark))]'
        }`}
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
      />
      <div
        className={`absolute top-0 left-0 h-full pointer-events-none transition-all motion-reduce:transition-none ${
          current < prev.current ? 'bg-[rgba(255,0,0,0.4)]' : 'bg-[rgba(0,255,0,0.4)]'
        }`}
        style={{ width: `${chip}%` }}
      />
      {includeShield && shield?.current > 0 && (
        <div
          className="absolute top-0 left-0 h-full bg-[var(--color-info-light)] opacity-50 transition-all motion-reduce:transition-none pointer-events-none"
          style={{ width: `${Math.min(percent + shieldPercent, 100)}%` }}
          data-testid="shield-bar"
        />
      )}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs pointer-events-none">
        {showPercent ? `${Math.round(percent)}%` : `${current}/${max}`}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-sm">
      {renderBar(
        primaryPercent,
        primaryChip,
        prevPrimary,
        primary.current,
        primary.max,
        'primary',
        true,
      )}
      {secondary &&
        renderBar(
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
  }),
  shield: PropTypes.shape({
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),
};

ResourceBars.defaultProps = {
  secondary: null,
  shield: null,
};
