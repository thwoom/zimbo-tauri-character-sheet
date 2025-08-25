import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { FaBoxOpen, FaMagnifyingGlass, FaWandMagicSparkles } from 'react-icons/fa6';
import useInventory from '../hooks/useInventory.js';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';
import AddItemModal from './AddItemModal.jsx';
import ItemDetailModal from './ItemDetailModal.jsx';
import Panel from './ui/Panel';
import { getTagDescription } from '../data/itemTags.js';

const tagStyle = {
  display: 'inline-block',
  background: 'var(--overlay-info, rgba(95, 209, 193, 0.2))',
  border: '1px solid var(--color-accent)',
  color: 'var(--color-accent)',
  padding: '0.125rem 0.375rem',
  borderRadius: 'var(--hud-radius-sm)',
  fontSize: '0.75rem',
  marginRight: '0.25rem',
  marginBottom: '0.25rem',
};

function InventoryPanel({ character, setCharacter, saveToHistory, setShowAddItemModal }) {
  const {
    totalWeight,
    maxLoad,
    handleEquipItem,
    handleConsumeItem,
    handleDropItem,
    handleAddItem,
  } = useInventory(character, setCharacter);

  const [showAdd, setShowAdd] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return character.inventory.filter(
      (i) => !i.equipped && i.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [character.inventory, search]);

  const loadWarn = totalWeight > maxLoad;

  return (
    <Panel glow="inventory">
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
        <FaBoxOpen /> Inventory
      </h3>
      <div
        style={{
          fontSize: '0.75rem',
          color: loadWarn ? 'var(--color-danger)' : 'var(--color-gray-400)',
        }}
      >
        Load: {totalWeight}/{maxLoad}
      </div>
      <div
        style={{
          margin: 'var(--space-sm) 0',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
        }}
      >
        <FaMagnifyingGlass />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          style={{ flex: 1 }}
        />
        <button
          onClick={() => {
            setShowAdd(true);
            if (setShowAddItemModal) setShowAddItemModal(true);
          }}
        >
          Add Item
        </button>
      </div>
      <div style={{ maxHeight: '40vh', overflow: 'auto' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              borderLeft: '4px solid var(--color-accent)',
              padding: 'var(--space-sm)',
              marginBottom: 'var(--space-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                onClick={() => setDetailItem(item)}
                style={{
                  cursor: 'pointer',
                  color: item.magical ? 'var(--color-warning)' : 'var(--color-white)',
                }}
              >
                {item.name}
                {item.magical && (
                  <FaWandMagicSparkles title="Magical Item" style={{ marginLeft: 4 }} />
                )}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                {item.type === 'consumable' && item.quantity > 0 && (
                  <button
                    onClick={() => {
                      saveToHistory('Inventory Change');
                      handleConsumeItem(item.id);
                    }}
                    aria-label={`Use ${item.name}`}
                  >
                    Use
                  </button>
                )}
                {item.slot && (
                  <button
                    onClick={() => handleEquipItem(item.id)}
                    aria-label={`Equip ${item.name}`}
                  >
                    Equip
                  </button>
                )}
                <button onClick={() => handleDropItem(item.id)} aria-label={`Drop ${item.name}`}>
                  Drop
                </button>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: 'var(--space-xs)' }}>
              {item.tags &&
                item.tags.map((tag) => (
                  <span key={tag} style={tagStyle} title={getTagDescription(tag)}>
                    {tag}
                  </span>
                ))}
              {typeof item.weight === 'number' && <div>Weight: {item.weight}</div>}
              {item.quantity > 1 && <div>Qty: {item.quantity}</div>}
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <AddItemModal
          isOpen={showAdd}
          onAdd={(item) => {
            saveToHistory('Inventory Change');
            handleAddItem(item);
          }}
          onClose={() => {
            setShowAdd(false);
            if (setShowAddItemModal) setShowAddItemModal(false);
          }}
        />
      )}
      {detailItem && <ItemDetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
    </Panel>
  );
}

InventoryPanel.propTypes = {
  character: PropTypes.shape({
    inventory: PropTypes.arrayOf(inventoryItemType).isRequired,
  }).isRequired,
  setCharacter: PropTypes.func.isRequired,
  saveToHistory: PropTypes.func.isRequired,
  setShowAddItemModal: PropTypes.func.isRequired,
};

export default InventoryPanel;
