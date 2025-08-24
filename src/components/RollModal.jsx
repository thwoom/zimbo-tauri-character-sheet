import PropTypes from 'prop-types';
import { FaDiceD20 } from 'react-icons/fa6';
import GlassModal from './ui/GlassModal';

export default function RollModal({ isOpen, data = null, onClose }) {
  return (
    <GlassModal
      isOpen={isOpen && data}
      onClose={onClose}
      title="Roll Result"
      icon={<FaDiceD20 />}
      maxWidth="500px"
      variant="default"
    >
      {data && (
        <div style={{ textAlign: 'center' }}>
          {data.initialResult && (
            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-neutral)',
                marginBottom: '1rem',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              Original Roll: {data.initialResult}
            </div>
          )}
          {Array.isArray(data.result) ? (
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--color-neon)',
                marginBottom: '1rem',
                textShadow: 'var(--shadow-neon)',
                padding: '1rem',
                background: 'rgba(100, 241, 225, 0.05)',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(100, 241, 225, 0.2)',
              }}
            >
              {data.result.map((r, i) => (
                <div key={i}>{r}</div>
              ))}
            </div>
          ) : (
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--color-neon)',
                marginBottom: '1rem',
                textShadow: 'var(--shadow-neon)',
                padding: '1rem',
                background: 'rgba(100, 241, 225, 0.05)',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(100, 241, 225, 0.2)',
              }}
            >
              {data.initialResult ? `With Help: ${data.result}` : data.result}
            </div>
          )}
          {data.description && (
            <div
              style={{
                color: 'var(--color-text)',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '500',
              }}
            >
              {data.description}
            </div>
          )}
          {data.context && (
            <div
              style={{
                color: 'var(--color-neutral)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {data.context}
            </div>
          )}
        </div>
      )}
    </GlassModal>
  );
}

RollModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
