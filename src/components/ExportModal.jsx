import { saveFile, loadFile } from '../utils/fileStorage.js';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FaSatellite } from 'react-icons/fa6';
import { useCharacter } from '../state/CharacterContext.jsx';
import styles from './ExportModal.module.css';
import Button from './common/Button.jsx';
import ButtonGroup from './common/ButtonGroup.jsx';
import useModalTransition from './common/useModalTransition.js';

export default function ExportModal({ isOpen, onClose }) {
  const { character, addCharacter, selectedId } = useCharacter();
  const [fileName, setFileName] = useState(`character-${selectedId}.json`);
  const [message, setMessage] = useState('');
  const [isVisible, isActive] = useModalTransition(isOpen);

  useEffect(() => {
    setFileName(`character-${selectedId}.json`);
  }, [selectedId]);

  if (!isVisible) return null;

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
    <div className={styles.overlay}>
      <div
        className={`${styles.modal} ${styles.modalEnter} ${isActive ? styles.modalEnterActive : ''}`}
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
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleLoad}>Load</Button>
          <Button onClick={onClose}>Close</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

ExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
