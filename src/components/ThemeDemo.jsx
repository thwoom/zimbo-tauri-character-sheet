import { useState } from 'react';
import { FaDiceD20, FaExclamationTriangle, FaStar, FaTimes } from 'react-icons/fa6';
import { useTheme } from '../state/ThemeContext';
import GlassModal from './ui/GlassModal';

const ThemeDemo = () => {
  const { theme, setTheme, themes } = useTheme();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [modalVariant, setModalVariant] = useState('default');

  const themeLabels = {
    legacy: 'Legacy',
    'cosmic-v2': 'Cosmic v2',
    classic: 'Classic',
    moebius: 'Moebius',
    cyberpunk: 'Cyberpunk',
  };

  const openDemoModal = (variant) => {
    setModalVariant(variant);
    setShowDemoModal(true);
  };

  const getModalContent = () => {
    switch (modalVariant) {
      case 'success':
        return {
          title: 'Success!',
          icon: <FaStar />,
          content: (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Operation Completed
              </div>
              <p>Your action was successful. All systems are operational.</p>
            </div>
          ),
        };
      case 'warning':
        return {
          title: 'Warning',
          icon: <FaExclamationTriangle />,
          content: (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Caution Required
              </div>
              <p>Please review your selection before proceeding.</p>
            </div>
          ),
        };
      case 'danger':
        return {
          title: 'Error',
          icon: <FaTimes />,
          content: (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                System Error
              </div>
              <p>An unexpected error occurred. Please try again.</p>
            </div>
          ),
        };
      default:
        return {
          title: 'Roll Result',
          icon: <FaDiceD20 />,
          content: (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'var(--color-neon)',
                  marginBottom: '1rem',
                  textShadow: 'var(--shadow-neon)',
                  padding: '1rem',
                  background: 'rgba(100, 241, 225, 0.05)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid rgba(100, 241, 225, 0.2)',
                }}
              >
                d4: 4 = 4
              </div>
              <div style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Upper Hand</div>
            </div>
          ),
        };
    }
  };

  const modalData = getModalContent();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--color-text)', marginBottom: '2rem', textAlign: 'center' }}>
        Theme Demo
      </h1>

      {/* Theme Selector */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <label htmlFor="theme-select" style={{ color: 'var(--color-text)', marginRight: '1rem' }}>
          Current Theme:
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{
            padding: '0.5rem',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text)',
          }}
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {themeLabels[t] || t}
            </option>
          ))}
        </select>
      </div>

      {/* Modal Demo Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => openDemoModal('default')}
          style={{
            padding: '1rem',
            background: 'rgba(100, 241, 225, 0.2)',
            border: '1px solid rgba(100, 241, 225, 0.3)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-neon)',
            cursor: 'pointer',
            transition: 'var(--hud-transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <FaDiceD20 />
          Default Modal
        </button>
        <button
          onClick={() => openDemoModal('success')}
          style={{
            padding: '1rem',
            background: 'rgba(74, 179, 129, 0.2)',
            border: '1px solid rgba(74, 179, 129, 0.3)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-success)',
            cursor: 'pointer',
            transition: 'var(--hud-transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <FaStar />
          Success Modal
        </button>
        <button
          onClick={() => openDemoModal('warning')}
          style={{
            padding: '1rem',
            background: 'rgba(255, 193, 7, 0.2)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-warning)',
            cursor: 'pointer',
            transition: 'var(--hud-transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <FaExclamationTriangle />
          Warning Modal
        </button>
        <button
          onClick={() => openDemoModal('danger')}
          style={{
            padding: '1rem',
            background: 'rgba(220, 53, 69, 0.2)',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-danger)',
            cursor: 'pointer',
            transition: 'var(--hud-transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <FaTimes />
          Danger Modal
        </button>
      </div>

      {/* Theme Info */}
      <div
        style={{
          padding: '1.5rem',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius)',
          color: 'var(--color-text)',
        }}
      >
        <h3 style={{ color: 'var(--color-neon)', marginBottom: '1rem' }}>
          Current Theme: {themeLabels[theme]}
        </h3>
        <p style={{ color: 'var(--color-neutral)', marginBottom: '1rem' }}>
          This demo showcases the different modal variants and how they adapt to each theme. The
          cyberpunk theme is designed to match the sleek aesthetic you showed me.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <strong>Accent Color:</strong>
            <div
              style={{
                width: '100%',
                height: '2rem',
                background: 'var(--color-accent)',
                borderRadius: 'var(--radius-sm)',
                marginTop: '0.5rem',
              }}
            />
          </div>
          <div>
            <strong>Neon Color:</strong>
            <div
              style={{
                width: '100%',
                height: '2rem',
                background: 'var(--color-neon)',
                borderRadius: 'var(--radius-sm)',
                marginTop: '0.5rem',
                boxShadow: 'var(--shadow-neon)',
              }}
            />
          </div>
          <div>
            <strong>Glass Background:</strong>
            <div
              style={{
                width: '100%',
                height: '2rem',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                marginTop: '0.5rem',
              }}
            />
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <GlassModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title={modalData.title}
        icon={modalData.icon}
        variant={modalVariant}
        maxWidth="500px"
      >
        {modalData.content}
      </GlassModal>
    </div>
  );
};

export default ThemeDemo;
