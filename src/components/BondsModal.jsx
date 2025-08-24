import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaHandshake } from 'react-icons/fa6';
import GlassModal from './ui/GlassModal';

const BondsModal = ({ isOpen, bonds, onAddBond, onResolveBond, onRemoveBond, onClose }) => {
  const [newBond, setNewBond] = useState({ name: '', description: '' });

  const addBond = () => {
    if (newBond.name.trim()) {
      onAddBond(newBond);
      setNewBond({ name: '', description: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addBond();
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Bonds"
      icon={<FaHandshake />}
      variant="default"
      maxWidth="600px"
    >
      <div style={{ padding: '0' }}>
        <div style={{
          padding: '1rem',
          background: 'rgba(100, 241, 225, 0.1)',
          border: '1px solid rgba(100, 241, 225, 0.2)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#64f1e1', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Character Bonds: {bonds.length}
          </div>
        </div>

        {bonds.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-neutral)',
            fontSize: '1.1rem',
            fontStyle: 'italic'
          }}>
            No bonds yet.
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {bonds.map((bond, index) => (
              <div key={index} style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius)',
                transition: 'var(--hud-transition)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    color: 'var(--color-text)',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>
                    {bond.name}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => onResolveBond(index)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(74, 179, 129, 0.2)',
                        border: '1px solid rgba(74, 179, 129, 0.3)',
                        borderRadius: '6px',
                        color: '#4ab381',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => onRemoveBond(index)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(220, 53, 69, 0.2)',
                        border: '1px solid rgba(220, 53, 69, 0.3)',
                        borderRadius: '6px',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {bond.description && (
                  <div style={{
                    color: 'var(--color-neutral)',
                    fontSize: '0.9rem'
                  }}>
                    {bond.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{
          padding: '1rem',
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.2)',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            color: '#ffc107',
            marginBottom: '1rem',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>
            Add New Bond
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              color: '#64f1e1',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Character Name:
            </label>
            <input
              type="text"
              value={newBond.name}
              onChange={(e) => setNewBond({ ...newBond, name: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Enter character name"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#d0d7e2',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              color: '#64f1e1',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Bond Description:
            </label>
            <textarea
              value={newBond.description}
              onChange={(e) => setNewBond({ ...newBond, description: e.target.value })}
              placeholder="Describe the bond..."
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#d0d7e2',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px'
              }}
            />
          </div>
          <button
            onClick={addBond}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255, 193, 7, 0.2)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '6px',
              color: '#ffc107',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            Add Bond
          </button>
        </div>
      </div>
    </GlassModal>
  );
};

BondsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  bonds: PropTypes.array.isRequired,
  onAddBond: PropTypes.func.isRequired,
  onResolveBond: PropTypes.func.isRequired,
  onRemoveBond: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BondsModal;
