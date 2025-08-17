import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FaUserAstronaut } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import { useCharacter } from '../state/CharacterContext';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './BondsModal.module.css';

export default function BondsModal({ isOpen, onClose }) {
  const { character, setCharacter } = useCharacter();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  const addBond = () => {
    if (name.trim() && relationship.trim()) {
      setCharacter((prev) => ({
        ...prev,
        bonds: [
          ...prev.bonds,
          { name: name.trim(), relationship: relationship.trim(), resolved: false },
        ],
      }));
      setName('');
      setRelationship('');
    }
  };

  const removeBond = (index) => {
    setCharacter((prev) => ({
      ...prev,
      bonds: prev.bonds.filter((_, i) => i !== index),
    }));
  };

  const toggleResolved = (index) => {
    setCharacter((prev) => ({
      ...prev,
      bonds: prev.bonds.map((bond, i) =>
        i === index ? { ...bond, resolved: !bond.resolved } : bond,
      ),
    }));
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
            <h2 className={styles.title}>
              <FaUserAstronaut style={{ marginRight: '4px' }} /> Character Bonds
            </h2>
            {character.bonds.length === 0 ? (
              <p className={styles.empty}>No bonds yet.</p>
            ) : (
              <ul className={styles.bondList}>
                {character.bonds.map((bond, index) => (
                  <li key={index} className={styles.bondItem}>
                    <div className={bond.resolved ? styles.bondResolved : styles.bondText}>
                      <strong>{bond.name}</strong>: {bond.relationship}
                    </div>
                    <div className={styles.bondActions}>
                      <button
                        onClick={() => toggleResolved(index)}
                        className={`${styles.button} ${bond.resolved ? styles.unresolveButton : styles.resolveButton}`}
                      >
                        {bond.resolved ? 'Unresolve' : 'Resolve'}
                      </button>
                      <button
                        onClick={() => removeBond(index)}
                        className={`${styles.button} ${styles.removeButton}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.form}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className={styles.input}
              />
              <button onClick={addBond} className={styles.button}>
                Add Bond
              </button>
            </div>

            <button onClick={onClose} className={`${styles.button} ${styles.closeButton}`}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

BondsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
