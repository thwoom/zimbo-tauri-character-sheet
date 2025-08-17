import { saveFile, loadFile } from '../utils/fileStorage.js';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FaSatellite } from 'react-icons/fa6';
import { useCharacter } from '../state/CharacterContext';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './ExportModal.module.css';
import Button from './common/Button';
import ButtonGroup from './common/ButtonGroup';

export default function ExportModal({ isOpen, onClose }) {
  const { character, addCharacter, selectedId } = useCharacter();
  const [fileName, setFileName] = useState(`character-${selectedId}.json`);
  const [message, setMessage] = useState('');
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  useEffect(() => {
    setFileName(`character-${selectedId}.json`);
  }, [selectedId]);

  const handleSave = async () => {
    try {
      await saveFile(fileName, JSON.stringify(character, null, 2));
      setMessage('Character saved!');
    } catch (err) {
      setMessage('Failed to save.');
    }
  };

  const handleLoad = async () => {
    try {
      const contents = await loadFile(fileName);
      const data = JSON.parse(contents);
      if (data.id) {
        addCharacter(data);
      } else {
        addCharacter({ ...data });
      }
      setMessage('Character loaded!');
    } catch (err) {
      setMessage('Failed to load.');
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
              <FaSatellite style={{ marginRight: '4px' }} /> Export / Import
            </h2>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="filename.json"
              className={styles.input}
            />
            {message && <div className={styles.message}>{message}</div>}
            <ButtonGroup>
              <Button onClick={handleSave} data-testid="save-character">
                Save
              </Button>
              <Button onClick={handleLoad} data-testid="load-character">
                Load
              </Button>
              <Button onClick={onClose} data-testid="close-export">
                Close
              </Button>
            </ButtonGroup>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

ExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
