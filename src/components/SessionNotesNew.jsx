import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  FaCalendarDays,
  FaFloppyDisk,
  FaFolderOpen,
  FaLaptop,
  FaMobileScreen,
  FaTrash,
} from 'react-icons/fa6';
import useModal from '../hooks/useModal.js';
import { css } from '../styled-system/css';
import { saveFile } from '../utils/fileStorage.js';

const NOTES_FILE = 'session_notes.txt';

const ClearNotesModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div
      className={css({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      })}
    >
      <div
        className={css({
          backgroundColor: 'surface',
          border: '1px solid',
          borderColor: 'muted',
          borderRadius: 'md',
          padding: 'lg',
          maxWidth: '400px',
          width: '90%',
        })}
      >
        <p className={css({ color: 'text', marginBottom: 'md' })}>Clear all notes?</p>
        <div
          className={css({
            display: 'flex',
            gap: 'sm',
            justifyContent: 'flex-end',
          })}
        >
          <button
            className={css({
              padding: 'xs',
              paddingX: 'sm',
              backgroundColor: 'secondary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'sm',
              '&:hover': { opacity: 0.8 },
            })}
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className={css({
              padding: 'xs',
              paddingX: 'sm',
              backgroundColor: 'primary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'sm',
              '&:hover': { opacity: 0.8 },
            })}
            onClick={onCancel}
          >
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
      <div
        className={css({
          background: 'rgba(2, 30, 38, 0.8)',
          border: '1px solid rgba(100, 241, 225, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          width: compactMode ? 'auto' : '100%',
        })}
      >
        <div
          className={css({
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#64f1e1',
            marginBottom: '1rem',
            textAlign: 'center',
            borderBottom: '1px solid rgba(100, 241, 225, 0.2)',
            paddingBottom: '0.5rem',
          })}
        >
          Session Notes
        </div>
        <div className={css({ marginBottom: 'md' })}>
          <input
            className={css({
              width: '100%',
              padding: 'xs',
              backgroundColor: 'surface',
              color: 'text',
              border: '1px solid',
              borderColor: 'muted',
              borderRadius: 'sm',
              fontSize: 'sm',
              '&::placeholder': { color: 'muted' },
            })}
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            aria-label="Session tags"
          />
        </div>

        <div className={css({ marginBottom: 'md' })}>
          <textarea
            className={css({
              width: '100%',
              minHeight: '200px',
              padding: 'sm',
              backgroundColor: 'surface',
              color: 'text',
              border: '1px solid',
              borderColor: 'muted',
              borderRadius: 'sm',
              fontSize: 'sm',
              resize: 'vertical',
              fontFamily: 'mono',
              '&::placeholder': { color: 'muted' },
            })}
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Track important events, NPCs, plot threads, and campaign notes here..."
          />
        </div>

        {warning && (
          <div
            className={css({
              padding: 'sm',
              backgroundColor: 'secondary',
              color: 'background',
              borderRadius: 'sm',
              marginBottom: 'md',
              fontSize: 'sm',
            })}
          >
            {warning}
          </div>
        )}

        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'xs',
            marginBottom: 'md',
          })}
        >
          <button
            className={css({
              padding: 'xs',
              paddingX: 'sm',
              backgroundColor: 'primary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'xs',
              display: 'flex',
              alignItems: 'center',
              gap: 'xs',
              '&:hover': { opacity: 0.8 },
            })}
            onClick={() => {
              const timestamp = new Date().toLocaleString();
              setSessionNotes((prev) => prev + `\n[${timestamp}] `);
            }}
          >
            <FaCalendarDays />
            Timestamp
          </button>

          <button
            className={css({
              padding: 'xs',
              paddingX: 'sm',
              backgroundColor: 'primary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'xs',
              display: 'flex',
              alignItems: 'center',
              gap: 'xs',
              '&:hover': { opacity: 0.8 },
            })}
            onClick={() => {
              try {
                localStorage.setItem('sessionNotes', sessionNotes);
                localStorage.setItem('sessionTags', tags);
              } catch {
                setWarning('Save failed.');
              }
            }}
          >
            <FaFloppyDisk />
            Save
          </button>

          <button
            className={css({
              padding: 'xs',
              paddingX: 'sm',
              backgroundColor: 'primary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'xs',
              display: 'flex',
              alignItems: 'center',
              gap: 'xs',
              '&:hover': { opacity: 0.8 },
            })}
            onClick={() => {
              try {
                const savedNotes = localStorage.getItem('sessionNotes');
                const savedTags = localStorage.getItem('sessionTags');
                if (savedNotes) setSessionNotes(savedNotes);
                if (savedTags) setTags(savedTags);
              } catch {
                setWarning('Load failed.');
              }
            }}
          >
            <FaFolderOpen />
            Load
          </button>

          <button
            className={css({
              padding: 'xs',
              paddingX: 'sm',
              backgroundColor: 'secondary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'xs',
              display: 'flex',
              alignItems: 'center',
              gap: 'xs',
              '&:hover': { opacity: 0.8 },
            })}
            onClick={handleClear}
          >
            <FaTrash />
            Clear
          </button>

          <button
            className={css({
              padding: 'xs',
              paddingX: 'sm',
              backgroundColor: 'accent',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'xs',
              display: 'flex',
              alignItems: 'center',
              gap: 'xs',
              '&:hover': { opacity: 0.8 },
            })}
            onClick={() => setCompactMode(!compactMode)}
          >
            {compactMode ? <FaLaptop /> : <FaMobileScreen />}
            {compactMode ? 'Expand' : 'Compact'}
          </button>
        </div>

        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 'xs',
            color: 'muted',
          })}
        >
          <span>Version: Version unavailable</span>
          <button
            className={css({
              padding: 'xs',
              paddingX: 'sm',
              backgroundColor: 'accent',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              fontSize: 'xs',
              '&:hover': { opacity: 0.8 },
            })}
            onClick={exportMarkdown}
          >
            Export MD
          </button>
        </div>
      </div>

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
