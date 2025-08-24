import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import App from '../App';
import { containerVariants } from '../motion/variants.ts';
import { useSettings } from '../state/SettingsContext';
import { useTheme } from '../state/ThemeContext';
import CelebrationEffect from './effects/CelebrationEffect';

const FuturisticApp = () => {
  const { theme, setTheme } = useTheme();
  const { showDiagnostics } = useSettings();
  const [celebrationType, setCelebrationType] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Listen for celebration events
  useEffect(() => {
    const handleCelebration = (event) => {
      const { type } = event.detail;
      setCelebrationType(type);
      setShowCelebration(true);
    };

    window.addEventListener('zimbo-celebration', handleCelebration);
    return () => window.removeEventListener('zimbo-celebration', handleCelebration);
  }, []);

  const getParticleVariant = () => {
    if (theme === 'cosmic-v2') return 'starfield';
    if (theme === 'cosmic') return 'nebula';
    return 'minimal';
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* LIVE badge removed */}
      {/* Debug Panel (dev only) - Bottom Right */}
      {import.meta.env.DEV && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #64f1e1',
            borderRadius: '12px',
            padding: '16px',
            color: '#d0d7e2',
            maxWidth: '280px',
          }}
        >
          <h3 style={{ color: '#64f1e1', margin: '0 0 12px 0' }}>DEBUG PANEL</h3>
          <div style={{ fontSize: '12px' }}>
            <div>Theme: {theme}</div>
            <div>Diagnostics: {showDiagnostics ? 'ON' : 'OFF'}</div>
            <div>Particles: {getParticleVariant()}</div>
          </div>

          {/* Simple test buttons */}
          <div style={{ marginTop: '12px' }}>
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('zimbo-celebration', { detail: { type: 'levelup' } }),
                );
              }}
              style={{
                width: '100%',
                padding: '6px 8px',
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '6px',
                color: '#ffc107',
                fontSize: '11px',
                cursor: 'pointer',
                marginBottom: '6px',
              }}
            >
              🎉 Test Celebration
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                width: '100%',
                padding: '6px 8px',
                backgroundColor: 'rgba(220, 53, 69, 0.2)',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                borderRadius: '6px',
                color: '#dc3545',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              🔄 Clear Cache & Reload
            </button>
          </div>
        </div>
      )}

      {/* Main App Content */}
      <motion.div
        className="relative z-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <motion.div
                className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          }
        >
          <App />
        </Suspense>
      </motion.div>

      {/* Celebration Effects */}
      <AnimatePresence>
        {showCelebration && celebrationType && (
          <CelebrationEffect
            isActive={showCelebration}
            type={celebrationType}
            onComplete={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>

      {/* Ambient Glow Overlays for Cosmic Themes */}
      {(theme === 'cosmic' || theme === 'cosmic-v2') && (
        <>
          <motion.div
            className="fixed top-0 left-1/4 w-1/2 h-1/2 bg-neon/5 pointer-events-none z-5"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="fixed bottom-0 right-1/4 w-1/3 h-1/3 bg-neon/3 pointer-events-none z-5"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </>
      )}
    </div>
  );
};

export default FuturisticApp;
