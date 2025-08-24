import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import GlassModal from './ui/GlassModal';

const AddItemModal = ({ isOpen = true, onAdd, onClose, generateOptions }) => {
  const [newItem, setNewItem] = useState({ name: '', type: 'gear', quantity: 1 });
  const [options, setOptions] = useState([]);

  const saveItem = () => {
    onAdd(newItem);
    onClose();
  };

  const handleGenerateOptions = async () => {
    if (generateOptions) {
      try {
        const generated = await generateOptions();
        setOptions(generated);
      } catch (error) {
        console.error('Failed to generate options:', error);
      }
    }
  };

  const handleSelectOption = (option) => {
    setNewItem({
      name: option.name,
      type: option.type,
      description: option.flavor,
      effect: option.effect,
    });
  };

  const handleCopyPrompt = async () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        const prompt = `Generate a ${newItem.type} named "${newItem.name}" for a tabletop RPG`;
        await navigator.clipboard.writeText(prompt);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Item"
      icon={<FaPlus />}
      variant="success"
      maxWidth="500px"
    >
      <div style={{ padding: '0' }}>
        <div
          style={{
            padding: '1rem',
            background: 'rgba(74, 179, 129, 0.1)',
            border: '1px solid rgba(74, 179, 129, 0.2)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#4ab381', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Create New Item
          </div>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              color: '#64f1e1',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Item Name:
          </label>
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Enter item name"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#d0d7e2',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              color: '#64f1e1',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Item Type:
          </label>
          <select
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#d0d7e2',
              fontSize: '1rem',
              outline: 'none',
            }}
          >
            <option value="gear">Gear</option>
            <option value="weapon">Weapon</option>
            <option value="consumable">Consumable</option>
            <option value="armor">Armor</option>
          </select>
        </div>

        {generateOptions && (
          <button
            onClick={handleGenerateOptions}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(100, 241, 225, 0.2)',
              border: '1px solid rgba(100, 241, 225, 0.3)',
              borderRadius: '6px',
              color: '#64f1e1',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              marginBottom: '1rem',
              transition: 'all 0.3s ease',
            }}
          >
            Generate with AI
          </button>
        )}

        <button
          onClick={handleCopyPrompt}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255, 193, 7, 0.2)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '6px',
            color: '#ffc107',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            marginBottom: '1.5rem',
            transition: 'all 0.3s ease',
          }}
        >
          Copy Prompt
        </button>

        {options.length > 0 && (
          <div
            style={{
              maxHeight: '200px',
              overflow: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelectOption(option)}
                style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: 'var(--color-text)',
                  transition: 'all 0.3s ease',
                  ':last-child': {
                    borderBottom: 'none',
                  },
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(100, 241, 225, 0.1)';
                  e.target.style.color = '#64f1e1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--color-text)';
                }}
              >
                {option.flavor}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '2rem',
          }}
        >
          <button
            onClick={saveItem}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(74, 179, 129, 0.2)',
              border: '1px solid rgba(74, 179, 129, 0.3)',
              borderRadius: '6px',
              color: '#4ab381',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
          >
            Save Item
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </GlassModal>
  );
};

AddItemModal.propTypes = {
  isOpen: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  generateOptions: PropTypes.func,
};

export default AddItemModal;
