import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FaMeteor } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import useInventory from '../hooks/useInventory';
import { useCharacter } from '../state/CharacterContext';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './DamageModal.module.css';
import Button from './common/Button';
import ButtonGroup from './common/ButtonGroup';

export default function DamageModal({ isOpen, onClose, onLastBreath }) {
  const { character, setCharacter } = useCharacter();
  const [damage, setDamage] = useState('');
  const { totalArmor } = useInventory(character, setCharacter);
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  const effectiveDamage = () => {
    const dmg = parseInt(damage, 10);
    return isNaN(dmg) ? 0 : Math.max(0, dmg - totalArmor);
  };

  const applyDamage = () => {
    const dmg = parseInt(damage, 10);
    if (isNaN(dmg)) return;
    const finalDamage = Math.max(0, dmg - totalArmor);
    const newHp = Math.max(0, character.hp - finalDamage);
    setCharacter((prev) => ({
      ...prev,
      actionHistory: [
        { action: 'HP Change', state: structuredClone(prev), timestamp: Date.now() },
        ...prev.actionHistory.slice(0, 4),
      ],
      hp: newHp,
    }));
    setDamage('');
    onClose();
    if (newHp <= 0) {
      onLastBreath();
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
            <h2 className={styles.title}>
              <FaMeteor style={{ marginRight: '4px' }} /> Damage Calculator
            </h2>
            <div className={styles.info}>Armor: {totalArmor}</div>
            <input
              type="number"
              placeholder="Incoming damage"
              value={damage}
              onChange={(e) => setDamage(e.target.value)}
              className={styles.input}
            />
            <div className={styles.summary}>After armor: {effectiveDamage()}</div>
            <ButtonGroup>
              <Button onClick={applyDamage} className={styles.applyButton}>
                Apply
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ButtonGroup>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

DamageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLastBreath: PropTypes.func.isRequired,
};
