import PropTypes from 'prop-types';
import React from 'react';
import styles from './InventoryModal.module.css';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';
import useModalTransition from './common/useModalTransition.js';

const InventoryModal = ({ inventory, onEquip, onConsume, onDrop, onUpdateNotes, onClose }) => {
  const [isVisible, isActive] = useModalTransition(true);

  if (!isVisible) return null;

  return (
    <div className={styles.inventoryOverlay}>
      <div
        className={`${styles.inventoryModal} ${styles.modalEnter} ${
          isActive ? styles.modalEnterActive : ''
        }`}
      >
        <h2 className={styles.inventoryTitle}>🎒 Inventory</h2>

        {inventory.length === 0 ? (
          <p className={styles.inventoryEmpty}>No items</p>
        ) : (
          <ul className={styles.inventoryList}>
            {inventory.map((item) => (
              <li key={item.id} className={styles.inventoryItem}>
                <div className={styles.inventoryItemName}>
                  {item.name}
                  {item.quantity ? ` x${item.quantity}` : ''}
                  {item.description && (
                    <div className={styles.inventoryItemDescription}>{item.description}</div>
                  )}
                </div>
                <div className={styles.inventoryItemMeta}>
                  {item.addedAt && (
                    <div className={styles.inventoryAddedAt}>
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </div>
                  )}
                  <textarea
                    className={styles.inventoryNotesInput}
                    placeholder="Notes"
                    value={item.notes || ''}
                    onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                  />
                </div>
                <div className={styles.inventoryItemActions}>
                  {'equipped' in item && (
                    <button className={styles.inventoryButton} onClick={() => onEquip(item.id)}>
                      {item.equipped ? 'Unequip' : 'Equip'}
                    </button>
                  )}
                  {item.type === 'consumable' && (
                    <button className={styles.inventoryButton} onClick={() => onConsume(item.id)}>
                      Consume
                    </button>
                  )}
                  <button className={styles.inventoryButton} onClick={() => onDrop(item.id)}>
                    Drop
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.inventoryClose}>
          <button className={styles.inventoryButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

InventoryModal.propTypes = {
  inventory: PropTypes.arrayOf(inventoryItemType).isRequired,
  onEquip: PropTypes.func.isRequired,
  onConsume: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onUpdateNotes: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InventoryModal;
