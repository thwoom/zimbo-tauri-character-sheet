import { invoke } from '@tauri-apps/api/core';
import PropTypes from 'prop-types';
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
            await invoke('write_file', {
              path: 'session_notes.txt',
              contents: sessionNotes,
            });
          }}
        >
          <FaFloppyDisk className={styles.icon} /> Save
        </button>
        <button
          className={styles.button}
          onClick={async () => {
            const contents = await invoke('read_file', {
              path: 'session_notes.txt',
            }).catch(() => '');
            setSessionNotes(contents);
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
