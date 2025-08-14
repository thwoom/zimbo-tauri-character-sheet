import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { saveFile, loadFile } from '../utils/fileStorage.js';
import {
  FaClipboard,
  FaCalendarDays,
  FaFloppyDisk,
  FaFolderOpen,
  FaTrash,
  FaLaptop,
  FaMobileScreen,
} from 'react-icons/fa6';
import styles from './SessionNotes.module.css';

const SessionNotes = ({ sessionNotes, setSessionNotes, compactMode, setCompactMode }) => {
  const [warning, setWarning] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('__test', '1');
      localStorage.removeItem('__test');
    } catch {
      setWarning('Persistence unavailable; notes may not be saved.');
    }
  }, []);

  return (
    <div className={`${styles.panel} ${compactMode ? '' : styles.fullWidth}`}>
      <h3 className={styles.title}>
        <FaClipboard className={styles.icon} /> Session Notes
      </h3>
      <textarea
        className={styles.textarea}
        value={sessionNotes}
        onChange={(e) => setSessionNotes(e.target.value)}
        placeholder="Track important events, NPCs, plot threads, and campaign notes here..."
      />
      {warning && <div className={styles.warning}>{warning}</div>}
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => {
            const timestamp = new Date().toLocaleString();
            setSessionNotes((prev) => prev + (prev ? '\n\n' : '') + `--- ${timestamp} ---\n`);
          }}
        >
          <FaCalendarDays className={styles.icon} /> Timestamp
        </button>
        <button
          className={styles.button}
          onClick={async () => {
            try {
              await saveFile('session_notes.txt', sessionNotes);
            } catch {
              setWarning('Persistence unavailable; notes may not be saved.');
            }
          }}
        >
          <FaFloppyDisk className={styles.icon} /> Save
        </button>
        <button
          className={styles.button}
          onClick={async () => {
            try {
              const contents = await loadFile('session_notes.txt');
              setSessionNotes(contents);
            } catch {
              setWarning('Persistence unavailable; notes may not be loaded.');
            }
          }}
        >
          <FaFolderOpen className={styles.icon} /> Load
        </button>
        <button
          className={`${styles.button} ${styles.danger}`}
          onClick={() => {
            if (confirm('Clear all notes?')) {
              setSessionNotes('');
            }
          }}
        >
          <FaTrash className={styles.icon} /> Clear
        </button>
        <button
          className={`${styles.button} ${styles.compact}`}
          onClick={() => setCompactMode(!compactMode)}
        >
          {compactMode ? <FaLaptop /> : <FaMobileScreen />} {compactMode ? 'Expand' : 'Compact'}
        </button>
      </div>
    </div>
  );
};

SessionNotes.propTypes = {
  sessionNotes: PropTypes.string.isRequired,
  setSessionNotes: PropTypes.func.isRequired,
  compactMode: PropTypes.bool.isRequired,
  setCompactMode: PropTypes.func.isRequired,
};

export default SessionNotes;
