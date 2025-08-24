import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './AddItemModal.module.css';

const AddItemModal = ({ isOpen = true, onAdd, onClose, generateOptions }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'gear',
    quantity: 1,
    weight: 1,
    slot: '',
    tags: '',
    magical: false,
    description: '',
    damage: '',
    armor: 0,
    effects: '',
  });
  const [options, setOptions] = useState([]);
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  const saveItem = () => {
    const item = {
      ...newItem,
      tags: newItem.tags
        ? newItem.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      weight: Number(newItem.weight) || 0,
      armor: newItem.armor ? Number(newItem.armor) : undefined,
    };
    onAdd(item);
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
            <h2 className={styles.title}>Add Item</h2>
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

            <label htmlFor="item-desc" className={styles.label}>
              Description:
            </label>
            <textarea
              id="item-desc"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className={styles.textarea}
            />

            <label htmlFor="item-slot" className={styles.label}>
              Slot:
            </label>
            <input
              id="item-slot"
              type="text"
              value={newItem.slot}
              onChange={(e) => setNewItem({ ...newItem, slot: e.target.value })}
              className={styles.input}
              placeholder="e.g. Head, Chest, Weapon"
            />

            <label htmlFor="item-tags" className={styles.label}>
              Tags (comma separated):
            </label>
            <input
              id="item-tags"
              type="text"
              value={newItem.tags}
              onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
              className={styles.input}
            />

            <label htmlFor="item-weight" className={styles.label}>
              Weight:
            </label>
            <input
              id="item-weight"
              type="number"
              value={newItem.weight}
              onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
              className={styles.input}
            />

            <label htmlFor="item-damage" className={styles.label}>
              Damage:
            </label>
            <input
              id="item-damage"
              type="text"
              value={newItem.damage}
              onChange={(e) => setNewItem({ ...newItem, damage: e.target.value })}
              className={styles.input}
            />

            <label htmlFor="item-armor" className={styles.label}>
              Armor:
            </label>
            <input
              id="item-armor"
              type="number"
              value={newItem.armor}
              onChange={(e) => setNewItem({ ...newItem, armor: e.target.value })}
              className={styles.input}
            />

            <label className={styles.label}>
              <input
                type="checkbox"
                checked={newItem.magical}
                onChange={(e) => setNewItem({ ...newItem, magical: e.target.checked })}
              />
              Magical
            </label>

            <label htmlFor="item-effects" className={styles.label}>
              Special Effects / Moves:
            </label>
            <textarea
              id="item-effects"
              value={newItem.effects}
              onChange={(e) => setNewItem({ ...newItem, effects: e.target.value })}
              className={styles.textarea}
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
