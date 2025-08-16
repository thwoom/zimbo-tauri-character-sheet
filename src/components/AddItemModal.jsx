import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './AddItemModal.module.css';

const itemTypes = ['gear', 'weapon', 'armor', 'consumable', 'magic', 'material'];

const AddItemModal = ({ onAdd, onClose, generateOptions }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('gear');
  const [flavor, setFlavor] = useState('');
  const [effect, setEffect] = useState('');
  const [options, setOptions] = useState([]);

  const handleGenerate = async () => {
    const generated = await generateOptions(name, type);
    setOptions(generated);
  };

  const handleSelect = (opt) => {
    setName(opt.name || '');
    setType(opt.type || 'gear');
    setFlavor(opt.flavor || '');
    setEffect(opt.effect || '');
  };

  const handleSave = () => {
    onAdd({ name, type, description: flavor, effect });
    onClose();
  };

  const handleCopyPrompt = () => {
    const prompt = `Create a ${type} item named ${name} with flavor text and effect.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(prompt);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Add Item</h2>
        <label className={styles.label}>
          Name
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={styles.label}>
          Type
          <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
            {itemTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.actions}>
          <button className={styles.button} onClick={handleGenerate}>
            Generate with AI
          </button>
          <button className={styles.button} onClick={handleCopyPrompt}>
            Copy Prompt
          </button>
        </div>
        {options.length > 0 && (
          <ul className={styles.options}>
            {options.map((opt, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className={styles.optionButton}
                  onClick={() => handleSelect(opt)}
                >
                  <div className={styles.optionFlavor}>{opt.flavor}</div>
                  <div className={styles.optionEffect}>{opt.effect}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
        <label className={styles.label}>
          Flavor Text
          <textarea
            className={styles.textarea}
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
          />
        </label>
        <label className={styles.label}>
          Effect
          <textarea
            className={styles.textarea}
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
          />
        </label>
        <div className={styles.footer}>
          <button className={styles.button} onClick={handleSave}>
            Save
          </button>
          <button className={styles.button} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

AddItemModal.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  generateOptions: PropTypes.func,
};

AddItemModal.defaultProps = {
  generateOptions: async () => [],
};

export default AddItemModal;
