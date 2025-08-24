import PropTypes from 'prop-types';
import ModalBase from './ModalBase';

// StandardModal: single source of truth for modal chrome
// - Consistent header with title and close button
// - Themed surface using CSS variables
// - Optional footer actions
// - Size presets via `size`
export default function StandardModal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  const maxWidthBySize = {
    sm: 480,
    md: 720,
    lg: 960,
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      contentProps={{
        style: {
          maxWidth: maxWidthBySize[size] ?? maxWidthBySize.md,
          backgroundColor: 'var(--color-modal-bg, rgba(0,0,0,0.8))',
          border: '1px solid var(--panel-border, rgba(255,255,255,0.12))',
          borderRadius: 12,
          boxShadow: '0 20px 60px var(--panel-shadow, rgba(0,0,0,0.6))',
        },
      }}
    >
      <div>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: 16,
            borderBottom: '1px solid var(--panel-border, rgba(255,255,255,0.12))',
            background: 'var(--color-modal-bg-secondary, transparent)',
          }}
        >
          <div style={{ color: 'var(--color-text, #d0d7e2)', fontWeight: 700 }}>{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: '1px solid var(--panel-border, rgba(255,255,255,0.2))',
              color: 'var(--color-text, #d0d7e2)',
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 16, maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: 16,
              borderTop: '1px solid var(--panel-border, rgba(255,255,255,0.12))',
              background: 'var(--color-modal-bg-secondary, transparent)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </ModalBase>
  );
}

StandardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
