import PropTypes from 'prop-types';
import { FaDiceD20 } from 'react-icons/fa6';
import { useAccessibility } from '../hooks/useAccessibility';
import { useDiceRoller } from '../hooks/useDiceRoller';
import { useTheme } from '../hooks/useTheme';
import { useCharacter } from '../state/CharacterContext';

const RollHistory = ({ rolls = [], onRollClick }) => {
  const { character } = useCharacter();
  const { rollDie } = useDiceRoller();
  const { theme } = useTheme();
  const { reducedMotion } = useAccessibility();

  if (!rolls || rolls.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#6b7280',
          fontSize: '0.9rem',
        }}
      >
        No rolls yet. Start playing to see your roll history!
      </div>
    );
  }

  return (
    <div
      style={{
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '1rem',
      }}
    >
      {rolls.map((roll, index) => (
        <div
          key={index}
          onClick={() => onRollClick && onRollClick(roll)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            marginBottom: '0.5rem',
            background: 'rgba(100, 241, 225, 0.1)',
            border: '1px solid rgba(100, 241, 225, 0.3)',
            borderRadius: '8px',
            cursor: onRollClick ? 'pointer' : 'default',
            transition: reducedMotion ? 'none' : 'all 0.2s ease',
            ...(onRollClick && {
              ':hover': {
                background: 'rgba(100, 241, 225, 0.2)',
                borderColor: 'rgba(100, 241, 225, 0.5)',
              },
            }),
          }}
        >
          <FaDiceD20 style={{ color: '#64f1e1', fontSize: '1.2rem' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', color: '#d0d7e2' }}>{roll.description || 'Roll'}</div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {roll.result} {roll.modifier && `(${roll.modifier > 0 ? '+' : ''}${roll.modifier})`}
            </div>
          </div>
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#64f1e1',
            }}
          >
            {roll.total}
          </div>
        </div>
      ))}
    </div>
  );
};

RollHistory.propTypes = {
  rolls: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      result: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
      modifier: PropTypes.number,
      total: PropTypes.number.isRequired,
    }),
  ),
  onRollClick: PropTypes.func,
};

export default RollHistory;
