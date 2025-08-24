import React from 'react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #64f1e1',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '500px',
          width: '100%',
          color: '#ffffff',
        }}
      >
        {title && (
          <h2 style={{ margin: '0 0 20px 0', color: '#64f1e1' }}>{title}</h2>
        )}
        <div>{children}</div>
        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            backgroundColor: '#64f1e1',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SimpleModal;

