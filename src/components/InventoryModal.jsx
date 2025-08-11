import React from 'react';
import './InventoryModal.css';

const InventoryModal = ({ inventory, onEquip, onConsume, onDrop, onClose }) => {
  return (
    <div className="inventory-overlay">
      <div className="inventory-modal">
        <h2 className="inventory-title">🎒 Inventory</h2>
        {inventory.length === 0 ? (
          <p className="inventory-empty">No items</p>
        ) : (
          <ul className="inventory-list">
            {inventory.map((item) => (
              <li key={item.id} className="inventory-item">
                <div className="inventory-item-name">
                  {item.name}
                  {item.quantity ? ` x${item.quantity}` : ''}
                </div>
                <div className="inventory-item-actions">
                  {'equipped' in item && (
                    <button className="inventory-button" onClick={() => onEquip(item.id)}>
                      {item.equipped ? 'Unequip' : 'Equip'}
                    </button>
                  )}
                  {item.type === 'consumable' && (
                    <button className="inventory-button" onClick={() => onConsume(item.id)}>
                      Consume
                    </button>
                  )}
                  <button className="inventory-button" onClick={() => onDrop(item.id)}>
                    Drop
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="inventory-close">
          <button className="inventory-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
