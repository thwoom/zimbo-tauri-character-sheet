import PropTypes from 'prop-types';
import React, { useState } from 'react';

const AddItemModal = ({ handleAddItem, onClose }) => {
  const [newItem, setNewItem] = useState({ name: '', type: 'gear', quantity: 1 });

  const saveItem = () => {
    handleAddItem(newItem);
    onClose();
  };

  return (
    <div>
      <input
        type="text"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        placeholder="Item name"
      />
      <button onClick={saveItem}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

AddItemModal.propTypes = {
  handleAddItem: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddItemModal;
