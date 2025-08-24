import PropTypes from 'prop-types';
import { FaBoxOpen } from 'react-icons/fa6';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';
import GlassModal from './ui/GlassModal';

const InventoryModal = ({
  isOpen = true,
  inventory,
  onEquip,
  onConsume,
  onDrop,
  onUpdateNotes = () => {},
  onClose,
}) => {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Inventory"
      icon={<FaBoxOpen />}
      variant="default"
      maxWidth="800px"
    >
      <div style={{ padding: '0' }}>
        <div
          style={{
            padding: '1rem',
            background: 'rgba(100, 241, 225, 0.1)',
            border: '1px solid rgba(100, 241, 225, 0.2)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#64f1e1', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Items: {inventory.length}
          </div>
        </div>

        {inventory.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--color-neutral)',
              fontSize: '1.1rem',
            }}
          >
            No items in inventory
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {inventory.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius)',
                  transition: 'var(--hud-transition)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: 'var(--color-text)',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {item.name}
                      {item.quantity ? ` x${item.quantity}` : ''}
                    </div>
                    {item.description && (
                      <div
                        style={{
                          color: 'var(--color-neutral)',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                    {item.addedAt && (
                      <div
                        style={{
                          color: 'var(--color-neutral)',
                          fontSize: '0.8rem',
                          fontStyle: 'italic',
                        }}
                      >
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {'equipped' in item && (
                      <button
                        onClick={() => onEquip(item.id)}
                        data-testid="equip-toggle"
                        style={{
                          padding: '0.5rem 1rem',
                          background: item.equipped
                            ? 'rgba(74, 179, 129, 0.2)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${
                            item.equipped ? 'rgba(74, 179, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                          }`,
                          borderRadius: '6px',
                          color: item.equipped ? '#4ab381' : 'var(--color-text)',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {item.equipped ? 'Unequip' : 'Equip'}
                      </button>
                    )}
                    {item.type === 'consumable' && (
                      <button
                        onClick={() => onConsume(item.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(255, 193, 7, 0.2)',
                          border: '1px solid rgba(255, 193, 7, 0.3)',
                          borderRadius: '6px',
                          color: '#ffc107',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Consume
                      </button>
                    )}
                    <button
                      onClick={() => onDrop(item.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(220, 53, 69, 0.2)',
                        border: '1px solid rgba(220, 53, 69, 0.3)',
                        borderRadius: '6px',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Drop
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Notes"
                  value={item.notes || ''}
                  onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '60px',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassModal>
  );
};

InventoryModal.propTypes = {
  isOpen: PropTypes.bool,
  inventory: PropTypes.arrayOf(inventoryItemType).isRequired,
  onEquip: PropTypes.func.isRequired,
  onConsume: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onUpdateNotes: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default InventoryModal;
