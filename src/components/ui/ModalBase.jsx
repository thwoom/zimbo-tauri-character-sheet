import PropTypes from 'prop-types';

// A minimal, theme-agnostic modal shell.
const ModalBase = ({ isOpen, onClose, children, className = '', style = {} }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        ...style,
      }}
      onClick={onClose}
    >
      <div
        className={className}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(2, 30, 38, 0.95)',
          border: '1px solid rgba(100, 241, 225, 0.3)',
          borderRadius: '8px',
          padding: '1.5rem',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

ModalBase.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ModalBase;
