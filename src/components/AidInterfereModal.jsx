import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaHand, FaHandshake } from 'react-icons/fa6';
import GlassModal from './ui/GlassModal';

const AidInterfereModal = ({ isOpen, onConfirm, onCancel, bonds = [] }) => {
  const [action, setAction] = useState('aid');
  const [selectedBond, setSelectedBond] = useState('');

  const handleConfirm = () => {
    onConfirm({ action, bond: selectedBond });
  };

  const getIcon = () => {
    return action === 'aid' ? <FaHandshake /> : <FaHand />;
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onCancel}
      title="Aid or Interfere"
      icon={getIcon()}
      maxWidth="500px"
    >
      <div style={{ padding: '0' }}>
        {/* Action Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              color: '#64f1e1',
              marginBottom: '1rem',
              fontSize: '1.1rem',
            }}
          >
            Choose Action
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                background:
                  action === 'aid' ? 'rgba(100, 241, 225, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  action === 'aid' ? 'rgba(100, 241, 225, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                }`,
                borderRadius: '6px',
                color: action === 'aid' ? '#64f1e1' : '#d0d7e2',
                transition: 'all 0.3s ease',
              }}
            >
              <input
                type="radio"
                name="action"
                value="aid"
                checked={action === 'aid'}
                onChange={(e) => setAction(e.target.value)}
                style={{ margin: 0 }}
              />
              <FaHandshake />
              <span>Aid</span>
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                background:
                  action === 'interfere' ? 'rgba(100, 241, 225, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  action === 'interfere' ? 'rgba(100, 241, 225, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                }`,
                borderRadius: '6px',
                color: action === 'interfere' ? '#64f1e1' : '#d0d7e2',
                transition: 'all 0.3s ease',
              }}
            >
              <input
                type="radio"
                name="action"
                value="interfere"
                checked={action === 'interfere'}
                onChange={(e) => setAction(e.target.value)}
                style={{ margin: 0 }}
              />
              <FaHand />
              <span>Interfere</span>
            </label>
          </div>
        </div>

        {/* Bond Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              color: '#64f1e1',
              marginBottom: '1rem',
              fontSize: '1.1rem',
            }}
          >
            Select Bond
          </h3>
          {bonds.length === 0 ? (
            <div
              style={{
                padding: '1rem',
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.2)',
                borderRadius: '6px',
                color: '#ffc107',
                textAlign: 'center',
              }}
            >
              No bonds available for this action.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: '0.5rem',
              }}
            >
              {bonds.map((bond, index) => (
                <label
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '1rem',
                    background:
                      selectedBond === bond
                        ? 'rgba(100, 241, 225, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      selectedBond === bond
                        ? 'rgba(100, 241, 225, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    borderRadius: '8px',
                    color: selectedBond === bond ? '#64f1e1' : '#d0d7e2',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="bond"
                    value={bond}
                    checked={selectedBond === bond}
                    onChange={(e) => setSelectedBond(e.target.value)}
                    style={{ margin: 0 }}
                  />
                  <span style={{ fontSize: '0.9rem' }}>{bond}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedBond}
            style={{
              padding: '0.75rem 1.5rem',
              background: selectedBond ? 'rgba(100, 241, 225, 0.2)' : 'rgba(107, 114, 128, 0.2)',
              border: `1px solid ${
                selectedBond ? 'rgba(100, 241, 225, 0.3)' : 'rgba(107, 114, 128, 0.3)'
              }`,
              borderRadius: '6px',
              color: selectedBond ? '#64f1e1' : '#6b7280',
              cursor: selectedBond ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </GlassModal>
  );
};

AidInterfereModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  bonds: PropTypes.arrayOf(PropTypes.string),
};

export default AidInterfereModal;
