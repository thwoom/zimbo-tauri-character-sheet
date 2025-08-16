import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  FaBoxOpen,
  FaMeteor,
  FaStar,
  FaFlask,
  FaShield,
  FaCube,
  FaSatellite,
} from 'react-icons/fa6';
import useInventory from '../hooks/useInventory';
import { debilityTypes } from '../state/character';
import styles from './InventoryPanel.module.css';
import AddItemModal from './AddItemModal.jsx';

const InventoryPanel = ({ character, setCharacter, rollDie, setRollResult, saveToHistory }) => {
  const { handleConsumeItem, handleAddItem } = useInventory(character, setCharacter);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>
        <FaBoxOpen className={styles.itemIcon} /> Equipment
      </h3>
      <button className={styles.useButton} onClick={() => setShowAddModal(true)}>
        Add Item
      </button>
      <div className={styles.items}>
        {character.inventory.slice(0, 5).map((item) => (
          <div key={item.id} className={`${styles.item} ${item.equipped ? styles.equipped : ''}`}>
            <div className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>
                  {item.type === 'weapon' && <FaMeteor className={styles.itemIcon} />}
                  {item.type === 'magic' && <FaStar className={styles.itemIcon} />}
                  {item.type === 'consumable' && <FaFlask className={styles.itemIcon} />}
                  {item.type === 'armor' && <FaShield className={styles.itemIcon} />}
                  {item.type === 'material' && <FaCube className={styles.itemIcon} />}
                  {(!item.type || item.type === 'gear') && (
                    <FaSatellite className={styles.itemIcon} />
                  )}
                  {item.name}
                  {item.equipped && <span className={styles.equippedMark}>✓</span>}
                  {item.description && (
                    <div className={styles.itemDescription}>{item.description}</div>
                  )}
                </div>
                <div className={styles.itemDetails}>
                  {item.damage && `${item.damage} damage`}
                  {item.armor && `+${item.armor} armor`}
                  {item.quantity > 1 && ` x${item.quantity}`}
                  {item.addedAt && (
                    <div className={styles.itemAddedAt}>
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </div>
                  )}
                  {item.notes && <div className={styles.itemNotes}>{item.notes}</div>}
                </div>
              </div>
              {item.type === 'consumable' && item.quantity > 0 && (
                <button
                  className={styles.useButton}
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
      {character.debilities.length > 0 && (
        <div className={styles.debilitiesSection}>
          <div className={styles.debilitiesTitle}>Active Debilities:</div>
          <div className={styles.debilitiesList}>
            {character.debilities.map((debility) => {
              const Icon = debilityTypes[debility].icon;
              return (
                <span key={debility} className={styles.debilityTag}>
                  {Icon && <Icon className={styles.itemIcon} />} {debilityTypes[debility].name}
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
          onClose={() => setShowAddModal(false)}
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
