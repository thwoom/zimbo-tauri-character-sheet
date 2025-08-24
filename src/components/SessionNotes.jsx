import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { saveFile, loadFile } from '../utils/fileStorage.js';
import useModal from '../hooks/useModal.js';
import {
  FaClipboard,
  FaCalendarDays,
  FaFloppyDisk,
  FaFolderOpen,
  FaTrash,
  FaLaptop,
  FaMobileScreen,
} from 'react-icons/fa6';
import Panel from './ui/Panel';
import styles from './SessionNotes.module.css';

const NOTES_FILE = 'session_notes.txt';

const ClearNotesModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>Clear all notes?</p>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={onConfirm}>
            Confirm
          </button>
          <button className={styles.button} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

ClearNotesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const SessionNotes = ({ sessionNotes, setSessionNotes, compactMode, setCompactMode }) => {
  const [warning, setWarning] = useState('');
  const [tags, setTags] = useState('');
  const clearModal = useModal();
  const handleClear = () => clearModal.open();
  const handleConfirmClear = () => {
    setSessionNotes('');
    clearModal.close();
  };

  useEffect(() => {
    try {
      localStorage.setItem('__test', '1');
      localStorage.removeItem('__test');
    } catch {
      setWarning('Persistence unavailable; notes may not be saved.');
    }
  }, []);

  const exportMarkdown = async () => {
    const header = `# Session Notes\n\nTags: ${tags || 'none'}\n\n`;
    const body = sessionNotes;
    try {
      await saveFile('session-notes.md', header + body);
    } catch {
      setWarning('Export failed.');
    }
  };

  return (
    <>
      <Panel
        className={`${styles.container} ${
          compactMode ? styles.collapsed : styles.expanded
        } ${compactMode ? '' : styles.fullWidth}`}
      >
        <h3 className={styles.title}>
          <FaClipboard className={styles.icon} /> Session Notes
        </h3>
        <input
          className={styles.tags}
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          aria-label="Session tags"
        />
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
            aria-label="Insert timestamp"
          >
            <FaCalendarDays className={styles.icon} /> Timestamp
          </button>
          <button
            className={styles.button}
            onClick={async () => {
              try {
                await saveFile(NOTES_FILE, sessionNotes);
              } catch {
                setWarning('Persistence unavailable; notes may not be saved.');
              }
            }}
            aria-label="Save notes"
          >
            <FaFloppyDisk className={styles.icon} /> Save
          </button>
          <button
            className={styles.button}
            onClick={async () => {
              try {
                const contents = await loadFile(NOTES_FILE);
                setSessionNotes(contents);
              } catch {
                setWarning('Persistence unavailable; notes may not be loaded.');
              }
            }}
            aria-label="Load notes"
          >
            <FaFolderOpen className={styles.icon} /> Load
          </button>
          <button className={styles.button} onClick={exportMarkdown} aria-label="Export markdown">
            Export MD
          </button>
          <button
            className={`${styles.button} ${styles.danger}`}
            onClick={handleClear}
            aria-label="Clear notes"
          >
            <FaTrash className={styles.icon} /> Clear
          </button>
          <button
            className={`${styles.button} ${styles.compact}`}
            onClick={() => setCompactMode(!compactMode)}
            aria-expanded={!compactMode}
            aria-label={compactMode ? 'Expand notes panel' : 'Compact notes panel'}
          >
            {compactMode ? <FaLaptop /> : <FaMobileScreen />} {compactMode ? 'Expand' : 'Compact'}
          </button>
        </div>
      </Panel>
      <ClearNotesModal
        isOpen={clearModal.isOpen}
        onConfirm={handleConfirmClear}
        onCancel={clearModal.close}
      />
    </>
  );
};

SessionNotes.propTypes = {
  sessionNotes: PropTypes.string.isRequired,
  setSessionNotes: PropTypes.func.isRequired,
  compactMode: PropTypes.bool.isRequired,
  setCompactMode: PropTypes.func.isRequired,
};

export default SessionNotes;
