import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FaBoxOpen,
  FaCube,
  FaFlask,
  FaMeteor,
  FaSatellite,
  FaShield,
  FaStar,
} from 'react-icons/fa6';
import useInventory from '../hooks/useInventory';
import { debilityTypes } from '../state/character';
import AddItemModal from './AddItemModal';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';
import Panel from './ui/Panel';

const InventoryPanel = ({
  character,
  setCharacter,
  rollDie,
  setRollResult,
  saveToHistory,
  setShowAddItemModal,
}) => {
  const { handleConsumeItem, handleAddItem, totalWeight } = useInventory(character, setCharacter);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Panel>
      <h3
        style={{
          color: 'var(--color-accent)',
          marginBottom: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          fontSize: '1.125rem',
        }}
      >
        <FaBoxOpen /> Equipment
      </h3>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>Load: {totalWeight}</div>
      <button
        style={{
          background: 'linear-gradient(45deg, var(--color-success), var(--color-success-dark))',
          color: 'var(--color-white)',
          padding: 'var(--space-sm) var(--space-md)',
          borderRadius: 'var(--hud-radius-sm)',
          fontSize: '0.75rem',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => {
          setShowAddModal(true);
          if (setShowAddItemModal) setShowAddItemModal(true);
        }}
      >
        Add Item
      </button>
      <div style={{ maxHeight: '40vh', overflow: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-sm)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {character.inventory.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'transparent',
                padding: 'var(--space-sm)',
                margin: 'var(--space-sm) 0',
                borderRadius: 'var(--hud-radius-sm)',
                borderLeft: `4px solid ${item.equipped ? 'var(--color-success)' : 'var(--color-accent)'}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      position: 'relative',
                    }}
                  >
                    {item.type === 'weapon' && <FaMeteor />}
                    {item.type === 'magic' && <FaStar />}
                    {item.type === 'consumable' && <FaFlask />}
                    {item.type === 'armor' && <FaShield />}
                    {item.type === 'material' && <FaCube />}
                    {(!item.type || item.type === 'gear') && <FaSatellite />}
                    {item.name}
                    {item.equipped && (
                      <span style={{ color: 'var(--color-success)', fontSize: '0.75rem' }}>✓</span>
                    )}
                    {item.description && (
                      <div
                        style={{
                          position: 'absolute',
                          display: 'none',
                          background: 'rgba(0, 0, 0, 0.3)',
                          color: 'white',
                          padding: 'var(--space-sm)',
                          borderRadius: 'var(--hud-radius-sm)',
                          fontSize: '0.75rem',
                          top: '100%',
                          left: 0,
                          zIndex: 10,
                          maxWidth: '200px',
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>
                    {item.damage && `${item.damage} damage`}
                    {item.armor && `+${item.armor} armor`}
                    {item.quantity > 1 && ` x${item.quantity}`}
                    {item.addedAt && (
                      <div style={{ color: 'var(--color-gray-500)' }}>
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                    )}
                    {item.notes && (
                      <div style={{ color: 'var(--color-gray-300)', marginTop: 'var(--space-sm)' }}>
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>
                {item.type === 'consumable' && item.quantity > 0 && (
                  <button
                    style={{
                      background:
                        'linear-gradient(45deg, var(--color-success), var(--color-success-dark))',
                      color: 'var(--color-white)',
                      padding: 'var(--space-sm) var(--space-md)',
                      borderRadius: 'var(--hud-radius-sm)',
                      fontSize: '0.75rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      saveToHistory('Inventory Change');
                      if (item.name === 'Healing Potion') {
                        const healing = rollDie(8);
                        setRollResult(`Used ${item.name}: healed ${healing} HP!`);
                        handleConsumeItem(item.id, (char) => ({
                          ...char,
                          hp: Math.min(char.maxHp, char.hp + healing),
                        }));
                      } else {
                        handleConsumeItem(item.id);
                      }
                    }}
                    aria-label={`Use ${item.name}`}
                  >
                    Use
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {character.debilities.length > 0 && (
        <div
          style={{
            marginTop: 'var(--space-md)',
            paddingTop: 'var(--space-sm)',
            borderTop: '1px solid var(--glass-border, rgba(95, 209, 193, 0.3))',
          }}
        >
          <div
            style={{
              color: 'var(--color-danger)',
              fontSize: '0.875rem',
              marginBottom: 'var(--space-md)',
            }}
          >
            Active Debilities:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {character.debilities.map((debility) => {
              const Icon = debilityTypes[debility].icon;
              return (
                <span
                  key={debility}
                  style={{
                    background: 'var(--overlay-danger, rgba(184, 79, 94, 0.2))',
                    border: '1px solid var(--color-danger)',
                    color: 'var(--color-danger-light)',
                    padding: '0.125rem 0.375rem',
                    borderRadius: 'var(--hud-radius-sm)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {Icon && <Icon />} {debilityTypes[debility].name}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {showAddModal && (
        <AddItemModal
          handleAddItem={(item) => {
            saveToHistory('Inventory Change');
            handleAddItem(item);
          }}
          onClose={() => {
            setShowAddModal(false);
            if (setShowAddItemModal) setShowAddItemModal(false);
          }}
        />
      )}
    </Panel>
  );
};

InventoryPanel.propTypes = {
  character: PropTypes.shape({
    inventory: PropTypes.arrayOf(inventoryItemType).isRequired,
    debilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  setCharacter: PropTypes.func.isRequired,
  rollDie: PropTypes.func.isRequired,
  setRollResult: PropTypes.func.isRequired,
  saveToHistory: PropTypes.func.isRequired,
  setShowAddItemModal: PropTypes.func.isRequired,
};

export default InventoryPanel;
