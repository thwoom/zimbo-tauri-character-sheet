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
import { css } from '../styled-system/css';
import AddItemModal from './AddItemModal';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';

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
    <div
      className={css({
        background: 'rgba(2, 30, 38, 0.8)',
        border: '1px solid rgba(100, 241, 225, 0.3)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      })}
    >
      <div
        className={css({
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: '#64f1e1',
          marginBottom: '1rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(100, 241, 225, 0.2)',
          paddingBottom: '0.5rem',
        })}
      >
        Equipment
      </div>
      <div className="flex items-center gap-sm mb-md">
        <FaBoxOpen />
      </div>
      <div className="text-xs text-[var(--color-gray-400)]">Load: {totalWeight}</div>
      <button
        className="bg-gradient-to-r from-success to-success-dark text-white px-sm py-1 rounded text-xs focus-visible:outline-accent"
        onClick={() => {
          setShowAddModal(true);
          if (setShowAddItemModal) setShowAddItemModal(true);
        }}
      >
        Add Item
      </button>
      <div className="max-h-[40vh] overflow-auto lg:max-h-[50vh] sm:max-h-[45vh]">
        <div className="grid gap-sm sm:grid-cols-1 lg:grid-cols-2">
          {character.inventory.map((item) => (
            <div
              key={item.id}
              className={`bg-[var(--overlay-darker)] p-sm my-sm rounded-sm border-l-4 ${
                item.equipped ? 'border-success' : 'border-accent'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-sm flex items-center gap-1 relative group">
                    {item.type === 'weapon' && <FaMeteor />}
                    {item.type === 'magic' && <FaStar />}
                    {item.type === 'consumable' && <FaFlask />}
                    {item.type === 'armor' && <FaShield />}
                    {item.type === 'material' && <FaCube />}
                    {(!item.type || item.type === 'gear') && <FaSatellite />}
                    {item.name}
                    {item.equipped && <span className="text-success text-xs">✓</span>}
                    {item.description && (
                      <div className="absolute hidden group-hover:block bg-black/80 text-white px-sm py-1 rounded text-xs top-full left-0 z-10 max-w-[200px]">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-[var(--color-gray-400)]">
                    {item.damage && `${item.damage} damage`}
                    {item.armor && `+${item.armor} armor`}
                    {item.quantity > 1 && ` x${item.quantity}`}
                    {item.addedAt && (
                      <div className="text-[var(--color-gray-500)]">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-[var(--color-gray-300)] mt-sm">{item.notes}</div>
                    )}
                  </div>
                </div>
                {item.type === 'consumable' && item.quantity > 0 && (
                  <button
                    className="bg-gradient-to-r from-success to-success-dark text-white px-sm py-1 rounded text-xs focus-visible:outline-accent"
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
        <div className="mt-md pt-sm border-t border-glass">
          <div className="text-danger text-sm mb-md">Active Debilities:</div>
          <div className="flex flex-wrap gap-1">
            {character.debilities.map((debility) => {
              const Icon = debilityTypes[debility].icon;
              return (
                <span
                  key={debility}
                  className="bg-[var(--overlay-danger)] border border-danger text-[var(--color-danger-light)] px-1.5 py-0.5 rounded text-xs flex items-center gap-1"
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
    </div>
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
