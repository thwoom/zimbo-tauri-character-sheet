import React from 'react';

const InventoryModal = ({ inventory, onEquip, onConsume, onDrop, onClose }) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const modalStyle = {
    background: '#1a1a2e',
    border: '2px solid #00ff88',
    borderRadius: '15px',
    padding: '20px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto'
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    padding: '5px 10px',
    cursor: 'pointer',
    margin: '3px'
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ color: '#00ff88', textAlign: 'center' }}>🎒 Inventory</h2>
        {inventory.length === 0 ? (
          <p style={{ color: '#aaa' }}>No items</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {inventory.map(item => (
              <li key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>
                  {item.name}{item.quantity ? ` x${item.quantity}` : ''}
                </div>
                <div style={{ marginTop: '5px' }}>
                  {'equipped' in item && (
                    <button style={buttonStyle} onClick={() => onEquip(item.id)}>
                      {item.equipped ? 'Unequip' : 'Equip'}
                    </button>
                  )}
                  {item.type === 'consumable' && (
                    <button style={buttonStyle} onClick={() => onConsume(item.id)}>
                      Consume
                    </button>
                  )}
                  <button style={buttonStyle} onClick={() => onDrop(item.id)}>
                    Drop
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button style={buttonStyle} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
