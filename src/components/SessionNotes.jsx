import styles from './SessionNotes.module.css';

const SessionNotes = ({ sessionNotes, setSessionNotes, compactMode, setCompactMode }) => {
  return (
    <div className={styles.panel} style={{ gridColumn: compactMode ? 'auto' : '1 / -1' }}>
      <h3 className={styles.title}>📝 Session Notes</h3>
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
          📅 Timestamp
        </button>
        <button
          className={`${styles.button} ${styles.danger}`}
          onClick={() => {
            if (confirm('Clear all notes?')) {
              setSessionNotes('');
            }
          }}
        >
          🗑️ Clear
        </button>
        <button
          className={`${styles.button} ${styles.compact}`}
          onClick={() => setCompactMode(!compactMode)}
        >
          {compactMode ? '🖥️' : '📱'} {compactMode ? 'Expand' : 'Compact'}
        </button>
      </div>
    </div>
  );
};

export default SessionNotes;
