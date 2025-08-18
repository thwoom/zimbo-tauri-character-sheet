import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './AddItemModal.module.css';

const AddItemModal = ({ isOpen = true, onAdd, onClose, generateOptions }) => {
  const [newItem, setNewItem] = useState({ name: '', type: 'gear', quantity: 1 });
  const [options, setOptions] = useState([]);
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <motion.div
            className={styles.modal}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
          >
            <label htmlFor="item-name" className={styles.label}>
              Name:
            </label>
            <input
              id="item-name"
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item name"
              className={styles.input}
            />

            {generateOptions && (
              <button onClick={handleGenerateOptions} className={styles.button}>
                Generate with AI
              </button>
            )}

            <button onClick={handleCopyPrompt} className={styles.button}>
              Copy prompt
            </button>

            {options.length > 0 && (
              <div className={styles.options}>
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectOption(option)}
                    className={styles.option}
                  >
                    {option.flavor}
                  </div>
                ))}
              </div>
            )}

            <button onClick={saveItem} className={styles.button}>
              Save
            </button>
            <button onClick={onClose} className={styles.button}>
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AddItemModal.propTypes = {
  isOpen: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  generateOptions: PropTypes.func,
};

export default AddItemModal;
