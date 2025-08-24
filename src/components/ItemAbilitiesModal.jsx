import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaClock, FaXmark } from 'react-icons/fa6';
import { backdropVariants, modalVariants } from '../motion/variants';
import glassStyles from '../styles/glassmorphic.module.css';

const ItemAbilitiesModal = ({
  isOpen,
  character,
  setCharacter,
  setRollResult,
  saveToHistory,
  onClose,
}) => {
  const [selectedAbility, setSelectedAbility] = useState(null);

  // Find items with special abilities
  const itemsWithAbilities = character.inventory.filter((item) => {
    return (
      item.equipped &&
      (item.name === 'Ring of Smooshed Chronologies' ||
        item.description?.includes('Chrono-Retcon') ||
        item.description?.includes('special ability'))
    );
  });

  const handleChronoRetcon = () => {
    if (character.resources.chronoUses > 0) {
      saveToHistory('Chrono-Retcon Used');
      setCharacter((prev) => ({
        ...prev,
        resources: {
          ...prev.resources,
          chronoUses: Math.max(0, prev.resources.chronoUses - 1),
        },
      }));
      setRollResult('⏰ Chrono-Retcon activated - rewrite any recent action!');
      setTimeout(() => setRollResult('Ready to roll!'), 3000);
      onClose();
    } else {
      setRollResult('❌ No uses remaining!');
      setTimeout(() => setRollResult('Ready to roll!'), 2000);
    }
  };

  const handleAdjustChronoUses = (increment) => {
    saveToHistory('Chrono-Retcon Uses Adjusted');
    setCharacter((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        chronoUses: Math.max(0, Math.min(2, prev.resources.chronoUses + increment)),
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 99998,
              border: 'none',
              cursor: 'pointer',
            }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            aria-label="Close modal backdrop"
          />

          {/* Modal */}
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px',
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(100, 241, 225, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 0 12px rgba(100, 241, 225, 0.3)',
                backdropFilter: 'blur(16px)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '24px 32px',
                  borderBottom: '1px solid rgba(100, 241, 225, 0.2)',
                  background:
                    'linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03))',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(100, 241, 225, 0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FaClock style={{ color: '#64f1e1', fontSize: '18px' }} />
                  </div>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'bold',
                      color: '#d0d7e2',
                      letterSpacing: '0.05em',
                    }}
                  >
                    ITEM ABILITIES
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      background:
                        'linear-gradient(to right, rgba(100, 241, 225, 0.4), transparent)',
                      marginLeft: '16px',
                    }}
                  ></div>
                  <button
                    onClick={onClose}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.color = '#d0d7e2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6b7280';
                    }}
                  >
                    <FaXmark size={16} />
                  </button>
                </div>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginTop: '8px',
                    marginLeft: '44px',
                  }}
                >
                  Special abilities from equipped items
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
                {itemsWithAbilities.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', padding: '64px 0' }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <FaClock style={{ fontSize: '32px', color: '#6b7280' }} />
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: '500' }}>
                      No Special Abilities
                    </p>
                    <p
                      style={{
                        color: 'rgba(107, 114, 128, 0.7)',
                        fontSize: '14px',
                        marginTop: '4px',
                      }}
                    >
                      Equip items with special abilities to see them here
                    </p>
                  </motion.div>
                ) : (
                  <div style={{ display: 'grid', gap: '24px' }}>
                    {itemsWithAbilities.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '24px',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = 'rgba(100, 241, 225, 0.3)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        }}
                      >
                        {/* Item Header */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '16px',
                          }}
                        >
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: 'rgba(100, 241, 225, 0.2)',
                              border: '1px solid rgba(100, 241, 225, 0.3)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FaClock style={{ color: '#64f1e1', fontSize: '20px' }} />
                          </div>
                          <div>
                            <h3
                              style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#d0d7e2',
                                marginBottom: '4px',
                              }}
                            >
                              {item.name}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>{item.description}</p>
                          </div>
                        </div>

                        {/* Chrono Retcon Ability */}
                        {item.name === 'Ring of Smooshed Chronologies' && (
                          <div style={{ marginTop: '16px' }}>
                            <h4
                              style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#64f1e1',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <FaClock /> Chrono-Retcon
                            </h4>

                            <p
                              style={{
                                fontSize: '14px',
                                color: '#d0d7e2',
                                marginBottom: '16px',
                                lineHeight: '1.5',
                              }}
                            >
                              Rewrite any recent action or decision. Use this ability to undo a
                              mistake or try a different approach.
                            </p>

                            {/* Uses Counter */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '16px',
                              }}
                            >
                              <span style={{ fontSize: '14px', color: '#d0d7e2' }}>
                                Uses Remaining: {character.resources.chronoUses}/2
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleAdjustChronoUses(-1)}
                                  disabled={character.resources.chronoUses <= 0}
                                  className={`${glassStyles.glassButton} ${glassStyles.glassButtonDanger} ${glassStyles.glassButtonSmall}`}
                                  style={{ fontSize: '12px', padding: '6px 12px' }}
                                >
                                  -1
                                </button>
                                <button
                                  onClick={() => handleAdjustChronoUses(1)}
                                  disabled={character.resources.chronoUses >= 2}
                                  className={`${glassStyles.glassButton} ${glassStyles.glassButtonSuccess} ${glassStyles.glassButtonSmall}`}
                                  style={{ fontSize: '12px', padding: '6px 12px' }}
                                >
                                  +1
                                </button>
                              </div>
                            </div>

                            {/* Use Button */}
                            <button
                              onClick={handleChronoRetcon}
                              disabled={character.resources.chronoUses === 0}
                              className={`${glassStyles.glassButton} ${glassStyles.glassButtonSuccess}`}
                              style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                background:
                                  character.resources.chronoUses > 0
                                    ? 'linear-gradient(45deg, #10b981, #059669)'
                                    : 'linear-gradient(45deg, #6b7280, #4b5563)',
                                opacity: character.resources.chronoUses === 0 ? 0.5 : 1,
                              }}
                            >
                              ⏰ Use Chrono-Retcon
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

ItemAbilitiesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  character: PropTypes.shape({
    inventory: PropTypes.array.isRequired,
    resources: PropTypes.shape({
      chronoUses: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  setCharacter: PropTypes.func.isRequired,
  setRollResult: PropTypes.func.isRequired,
  saveToHistory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ItemAbilitiesModal;
