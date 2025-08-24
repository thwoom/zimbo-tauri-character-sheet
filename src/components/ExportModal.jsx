import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaSatellite } from 'react-icons/fa6';
import { useCharacter } from '../state/CharacterContext';
import { loadFile, saveFile } from '../utils/fileStorage.js';
import GlassModal from './ui/GlassModal';

export default function ExportModal({ isOpen, onClose }) {
  const { character, addCharacter, selectedId } = useCharacter();
  const [fileName, setFileName] = useState(`character-${selectedId}.json`);
  const [message, setMessage] = useState('');

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
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export / Import"
      icon={<FaSatellite />}
      maxWidth="500px"
    >
      <div style={{ padding: '0' }}>
        <div
          style={{
            padding: '1rem',
            background: 'rgba(100, 241, 225, 0.1)',
            border: '1px solid rgba(100, 241, 225, 0.2)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#64f1e1', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Export / Import Character
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              color: '#64f1e1',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Filename:
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="filename.json"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#d0d7e2',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        {message && (
          <div
            style={{
              padding: '0.75rem',
              background:
                message.includes('saved') || message.includes('loaded')
                  ? 'rgba(74, 179, 129, 0.1)'
                  : 'rgba(220, 53, 69, 0.1)',
              border: `1px solid ${
                message.includes('saved') || message.includes('loaded')
                  ? 'rgba(74, 179, 129, 0.2)'
                  : 'rgba(220, 53, 69, 0.2)'
              }`,
              borderRadius: '6px',
              color:
                message.includes('saved') || message.includes('loaded') ? '#4ab381' : '#dc3545',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleSave}
            data-testid="save-character"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(100, 241, 225, 0.2)',
              border: '1px solid rgba(100, 241, 225, 0.3)',
              borderRadius: '6px',
              color: '#64f1e1',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            Save
          </button>
          <button
            onClick={handleLoad}
            data-testid="load-character"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(100, 241, 225, 0.2)',
              border: '1px solid rgba(100, 241, 225, 0.3)',
              borderRadius: '6px',
              color: '#64f1e1',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            Load
          </button>
          <button
            onClick={onClose}
            data-testid="close-export"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </GlassModal>
  );
}

ExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
