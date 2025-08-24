import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaSkull } from 'react-icons/fa6';
import GlassModal from './ui/GlassModal';

export default function LastBreathModal({ isOpen, onClose, rollDie }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const total = rollDie(6) + rollDie(6);
      let outcome;
      if (total >= 10) outcome = 'You evade Death... for now.';
      else if (total >= 7) outcome = 'Death offers you a bargain.';
      else outcome = 'Your journey ends here.';
      setResult({ total, outcome });
    } else {
      setResult(null);
    }
  }, [isOpen, rollDie]);

  return (
    <GlassModal
      isOpen={isOpen && result}
      onClose={onClose}
      title="Last Breath"
      icon={<FaSkull />}
      variant="danger"
      maxWidth="500px"
    >
      {result && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#64f1e1',
              marginBottom: '1rem',
            }}
          >
            Roll: {result.total}
          </div>
          <div
            style={{
              fontSize: '1.2rem',
              color: '#d0d7e2',
              marginBottom: '1.5rem',
            }}
          >
            {result.outcome}
          </div>
        </div>
      )}
    </GlassModal>
  );
}

LastBreathModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rollDie: PropTypes.func.isRequired,
};
