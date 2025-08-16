import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './AddItemModal.module.css';
import useModalTransition from './common/useModalTransition.js';

const AddItemModal = ({ onAdd, onClose }) => {
  const [newItem, setNewItem] = useState({ name: '', type: 'gear', quantity: 1 });
  const [isVisible, isActive] = useModalTransition(true);

  if (!isVisible) return null;

  const saveItem = () => {
    onAdd(newItem);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.modal} ${styles.modalEnter} ${isActive ? styles.modalEnterActive : ''}`}
      >
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Item name"
          className={styles.input}
        />
        <button onClick={saveItem} className={styles.button}>
          Save
        </button>
        <button onClick={onClose} className={styles.button}>
          Cancel
        </button>
      </div>
    </div>
  );
};

AddItemModal.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddItemModal;
