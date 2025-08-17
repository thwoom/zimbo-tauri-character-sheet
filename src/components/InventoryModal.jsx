import PropTypes from 'prop-types';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './InventoryModal.module.css';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';

const InventoryModal = ({
  isOpen = true,
  inventory,
  onEquip,
  onConsume,
  onDrop,
  onUpdateNotes,
  onClose,
}) => {
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.inventoryOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <motion.div
            className={styles.inventoryModal}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
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
                        <button
                          className={styles.inventoryButton}
                          onClick={() => onConsume(item.id)}
                        >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

InventoryModal.propTypes = {
  isOpen: PropTypes.bool,
  inventory: PropTypes.arrayOf(inventoryItemType).isRequired,
  onEquip: PropTypes.func.isRequired,
  onConsume: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onUpdateNotes: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InventoryModal;
