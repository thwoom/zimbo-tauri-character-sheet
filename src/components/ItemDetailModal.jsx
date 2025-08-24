import PropTypes from 'prop-types';
import React from 'react';
import { getTagDescription } from '../data/itemTags.js';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: 'var(--color-modal-bg, rgba(0,0,0,0.8))',
  color: 'var(--color-white)',
  padding: 'var(--space-lg)',
  borderRadius: 'var(--hud-radius-sm)',
  maxWidth: '400px',
  width: '90%',
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

function ItemDetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div style={overlayStyle} onClick={onClose} data-testid="item-detail-overlay">
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>{item.name}</h2>
        {item.description && <p>{item.description}</p>}
        {item.tags && (
          <div style={{ marginBottom: 'var(--space-sm)' }}>
            {item.tags.map((tag) => (
              <span key={tag} style={tagStyle} title={getTagDescription(tag)}>
                {tag}
              </span>
            ))}
          </div>
        )}
        {item.damage && <div>Damage: {item.damage}</div>}
        {item.armor && <div>Armor: +{item.armor}</div>}
        {typeof item.weight === 'number' && <div>Weight: {item.weight}</div>}
        {item.effects && <div style={{ marginTop: 'var(--space-sm)' }}>{item.effects}</div>}
        <div style={{ textAlign: 'right', marginTop: 'var(--space-md)' }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

ItemDetailModal.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ItemDetailModal;
