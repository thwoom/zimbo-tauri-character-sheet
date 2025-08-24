import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  FaHatCowboy,
  FaShield,
  FaHammer,
  FaHand,
  FaRing,
  FaShoePrints,
  FaWandMagicSparkles,
} from 'react-icons/fa6';
import useInventory from '../hooks/useInventory.js';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';
import ItemDetailModal from './ItemDetailModal.jsx';
import Panel from './ui/Panel';
import { getTagDescription } from '../data/itemTags.js';

const slotIcons = {
  Head: FaHatCowboy,
  Chest: FaShield,
  Weapon: FaHammer,
  'Off-hand': FaHand,
  Ring: FaRing,
  Feet: FaShoePrints,
};

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

function EquipmentPanel({ character, setCharacter }) {
  const { totalWeight, maxLoad, handleEquipItem } = useInventory(character, setCharacter);
  const [detailItem, setDetailItem] = useState(null);

  const slots = ['Head', 'Chest', 'Weapon', 'Off-hand', 'Ring', 'Feet'];
  const equipped = character.inventory.filter((i) => i.equipped);

  const loadWarn = totalWeight > maxLoad;

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
        <FaShield /> Equipment
      </h3>
      <div
        style={{
          fontSize: '0.75rem',
          color: loadWarn ? 'var(--color-danger)' : 'var(--color-gray-400)',
        }}
      >
        Load: {totalWeight}/{maxLoad}
      </div>
      <div style={{ marginTop: 'var(--space-md)', display: 'grid', gap: 'var(--space-md)' }}>
        {slots.map((slot) => {
          const item = equipped.find((i) => i.slot === slot);
          const Icon = slotIcons[slot] || FaShield;
          return (
            <div
              key={slot}
              style={{
                borderLeft: '4px solid var(--color-accent)',
                padding: 'var(--space-sm)',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Icon /> <strong>{slot}:</strong>
                  {item ? (
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
                  ) : (
                    <span style={{ color: 'var(--color-gray-400)' }}>(empty)</span>
                  )}
                </div>
                {item && (
                  <button
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => handleEquipItem(item.id)}
                    aria-label={`Unequip ${item.name}`}
                  >
                    Unequip
                  </button>
                )}
              </div>
              {item && (
                <div style={{ marginTop: 'var(--space-xs)', fontSize: '0.75rem' }}>
                  {item.tags &&
                    item.tags.map((tag) => (
                      <span key={tag} style={tagStyle} title={getTagDescription(tag)}>
                        {tag}
                      </span>
                    ))}
                  {item.damage && <div>Damage: {item.damage}</div>}
                  {item.armor && <div>Armor: +{item.armor}</div>}
                  {typeof item.weight === 'number' && <div>Weight: {item.weight}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {detailItem && <ItemDetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
    </Panel>
  );
}

EquipmentPanel.propTypes = {
  character: PropTypes.shape({ inventory: PropTypes.arrayOf(inventoryItemType).isRequired })
    .isRequired,
  setCharacter: PropTypes.func.isRequired,
};

export default EquipmentPanel;
