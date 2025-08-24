import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaCopy } from 'react-icons/fa6';
import { endUserPrompt, markdownTemplate, serverSidePrompt } from '../data/prompts';
import Button from './common/Button';
import GlassModal from './ui/GlassModal';

export default function PromptsModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState('');

  const handleCopy = async (label, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch (_) {
      setCopied('Failed to copy');
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Prompts for Import"
      icon={<FaCopy />}
      variant="default"
      maxWidth="600px"
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
            Copy-Paste Prompts
          </div>
          <div style={{ color: 'var(--color-neutral)', fontSize: '0.9rem' }}>
            Use these prompts to generate import-ready summaries
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius)',
              transition: 'var(--hud-transition)',
            }}
          >
            <h3
              style={{
                color: '#64f1e1',
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              End-User Prompt
            </h3>
            <p
              style={{
                color: 'var(--color-neutral)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}
            >
              For generating character summaries from user input
            </p>
            <Button
              onClick={() => handleCopy('End-user prompt copied', endUserPrompt)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(100, 241, 225, 0.2)',
                border: '1px solid rgba(100, 241, 225, 0.3)',
                borderRadius: '6px',
                color: '#64f1e1',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
            >
              Copy End-User Prompt
            </Button>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius)',
              transition: 'var(--hud-transition)',
            }}
          >
            <h3
              style={{
                color: '#64f1e1',
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Server Prompt
            </h3>
            <p
              style={{
                color: 'var(--color-neutral)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}
            >
              For processing character data on the server side
            </p>
            <Button
              onClick={() => handleCopy('Server prompt copied', serverSidePrompt)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(100, 241, 225, 0.2)',
                border: '1px solid rgba(100, 241, 225, 0.3)',
                borderRadius: '6px',
                color: '#64f1e1',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
            >
              Copy Server Prompt
            </Button>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius)',
              transition: 'var(--hud-transition)',
            }}
          >
            <h3
              style={{
                color: '#64f1e1',
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Markdown Template
            </h3>
            <p
              style={{
                color: 'var(--color-neutral)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}
            >
              Template for formatting character data in markdown
            </p>
            <Button
              onClick={() => handleCopy('Markdown template copied', markdownTemplate)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(100, 241, 225, 0.2)',
                border: '1px solid rgba(100, 241, 225, 0.3)',
                borderRadius: '6px',
                color: '#64f1e1',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
            >
              Copy Markdown Template
            </Button>
          </div>
        </div>

        {copied && (
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(74, 179, 129, 0.1)',
              border: '1px solid rgba(74, 179, 129, 0.2)',
              borderRadius: '6px',
              color: '#4ab381',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}
          >
            {copied}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </GlassModal>
  );
}

PromptsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
