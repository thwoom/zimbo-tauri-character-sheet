import { invoke } from '@tauri-apps/api/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FaSatellite } from 'react-icons/fa6';
import { useCharacter } from '../state/CharacterContext.jsx';
import styles from './ExportModal.module.css';

export default function ExportModal({ isOpen, onClose }) {
  const { character, setCharacter } = useCharacter();
  const [fileName, setFileName] = useState('character.json');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await invoke('write_file', {
        path: fileName,
        contents: JSON.stringify(character, null, 2),
      });
      setMessage('Character saved!');
    } catch (err) {
      setMessage('Failed to save.');
    }
  };

  const handleLoad = async () => {
    try {
      const contents = await invoke('read_file', { path: fileName });
      const data = JSON.parse(contents);
      setCharacter(data);
      setMessage('Character loaded!');
    } catch (err) {
      setMessage('Failed to load.');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
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
        <div className={styles.buttonGroup}>
          <button onClick={handleSave} className={styles.button}>
            Save
          </button>
          <button onClick={handleLoad} className={styles.button}>
            Load
          </button>
          <button onClick={onClose} className={styles.button}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

ExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
