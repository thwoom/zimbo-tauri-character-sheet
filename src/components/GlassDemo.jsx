import { useState } from 'react';
import { FaDiceD20 } from 'react-icons/fa';
import { useTheme } from '../state/ThemeContext';
import styles from '../styles/glassmorphic.module.css';
import GlassModal from './ui/GlassModal';

const GlassDemo = () => {
  const { theme, setTheme, themes } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const themeLabels = {
    legacy: 'Legacy',
    'cosmic-v2': 'Cosmic v2',
    classic: 'Classic',
    moebius: 'Moebius',
    cyberpunk: 'Cyberpunk',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--color-text)' }}>
        Glass Morphism Demo
      </h1>

      {/* Theme Selector */}
      <div className={styles.glassPanel} style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div className={styles.glassFlexBetween}>
          <label style={{ color: 'var(--color-text)', marginRight: '1rem' }}>
            Current Theme: {themeLabels[theme]}
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={styles.glassInput}
            style={{ padding: '0.5rem', minWidth: '150px' }}
          >
            {themes.map((t) => (
              <option key={t} value={t}>
                {themeLabels[t] || t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Glass Panels Demo */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Stats Panel */}
        <div className={styles.glassPanel} style={{ padding: '1.5rem' }}>
          <div className={styles.glassHeader} style={{ marginBottom: '1rem', padding: '1rem' }}>
            <h3 style={{ color: 'var(--color-text)', margin: 0 }}>Character Stats</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((stat) => (
              <div
                key={stat}
                className={styles.glassCard}
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                  {stat}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                  18
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-neutral)' }}>(+3)</div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Panel */}
        <div className={styles.glassPanel} style={{ padding: '1.5rem' }}>
          <div className={styles.glassHeader} style={{ marginBottom: '1rem', padding: '1rem' }}>
            <h3 style={{ color: 'var(--color-text)', margin: 0 }}>Equipment</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Entropic Cyber-Warhammer', damage: 'd10+3', equipped: true },
              { name: 'Ring of Smooshed Chronologies', damage: 'Special', equipped: true },
              { name: 'Cyber-Plated Vest', damage: '+1 Armor', equipped: false },
            ].map((item, index) => (
              <div key={index} className={styles.glassCard} style={{ padding: '1rem' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>
                      {item.name}
                    </div>
                    <div style={{ color: 'var(--color-neutral)', fontSize: '0.9rem' }}>
                      {item.damage}
                    </div>
                  </div>
                  {item.equipped && (
                    <div style={{ color: 'var(--color-success)', fontSize: '1.2rem' }}>✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dice Roller Panel */}
        <div className={styles.glassPanel} style={{ padding: '1.5rem' }}>
          <div className={styles.glassHeader} style={{ marginBottom: '1rem', padding: '1rem' }}>
            <h3 style={{ color: 'var(--color-text)', margin: 0 }}>Dice Roller</h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map((die) => (
              <button key={die} className={styles.glassButton} style={{ padding: '0.75rem' }}>
                {die}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={styles.glassButton}
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={() => setShowModal(true)}
            >
              <FaDiceD20 style={{ marginRight: '0.5rem' }} />
              Roll Result
            </button>
          </div>
        </div>
      </div>

      {/* Glass Buttons Demo */}
      <div className={styles.glassPanel} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>Glass Button Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className={styles.glassButton} style={{ padding: '0.75rem 1.5rem' }}>
            Default Button
          </button>
          <button
            className={`${styles.glassButton} ${styles.neonGlow}`}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Neon Glow
          </button>
          <button
            className={`${styles.glassButton} ${styles.neonBorder}`}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Neon Border
          </button>
          <button
            className={`${styles.glassButton} ${styles.neonText}`}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Neon Text
          </button>
        </div>
      </div>

      {/* Glass Input Demo */}
      <div className={styles.glassPanel} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>Glass Input Fields</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <input
            type="text"
            placeholder="Character Name"
            className={styles.glassInput}
            style={{ padding: '0.75rem' }}
          />
          <input
            type="number"
            placeholder="HP"
            className={styles.glassInput}
            style={{ padding: '0.75rem' }}
          />
          <select className={styles.glassInput} style={{ padding: '0.75rem' }}>
            <option>Select Class</option>
            <option>Barbarian</option>
            <option>Wizard</option>
            <option>Hybrid</option>
          </select>
        </div>
      </div>

      {/* Status Indicators */}
      <div className={styles.glassPanel} style={{ padding: '1.5rem' }}>
        <h3 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>Status Indicators</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.glassStatusSuccess} style={{ padding: '0.75rem 1rem' }}>
            ✓ Healthy
          </div>
          <div className={styles.glassStatusWarning} style={{ padding: '0.75rem 1rem' }}>
            ⚠️ Injured
          </div>
          <div className={styles.glassStatusError} style={{ padding: '0.75rem 1rem' }}>
            ✗ Critical
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <GlassModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Roll Result"
        icon={<FaDiceD20 />}
        variant="default"
        maxWidth="500px"
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--color-text)',
              marginBottom: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--glass-border)',
            }}
          >
            d4: 4 = 4
          </div>
          <div style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Upper Hand</div>
        </div>
      </GlassModal>
    </div>
  );
};

export default GlassDemo;
