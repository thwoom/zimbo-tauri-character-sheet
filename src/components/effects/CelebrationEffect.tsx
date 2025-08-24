import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface CelebrationEffectProps {
  isActive: boolean;
  type: 'levelup' | 'critical' | 'success' | 'confetti';
  onComplete?: () => void;
  duration?: number;
}

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  isActive,
  type,
  onComplete,
  duration = 3000,
}) => {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowEffect(true);
      const timer = setTimeout(() => {
        setShowEffect(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, duration, onComplete]);

  const getEffectStyle = () => {
    switch (type) {
      case 'levelup':
        return {
          background:
            'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0.1) 50%, transparent 100%)',
          animation: 'pulse 1s ease-in-out infinite alternate',
        };
      case 'critical':
        return {
          background:
            'radial-gradient(circle, rgba(255,0,0,0.4) 0%, rgba(255,0,0,0.1) 50%, transparent 100%)',
          animation: 'shake 0.5s ease-in-out',
        };
      case 'success':
        return {
          background:
            'radial-gradient(circle, rgba(76,175,80,0.3) 0%, rgba(76,175,80,0.1) 50%, transparent 100%)',
          animation: 'fadeInOut 2s ease-in-out',
        };
      case 'confetti':
        return {
          background:
            'radial-gradient(circle, rgba(255,107,107,0.2) 0%, rgba(78,205,196,0.2) 25%, rgba(69,183,209,0.2) 50%, rgba(150,206,180,0.2) 75%, transparent 100%)',
          animation: 'rotate 3s linear infinite',
        };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {showEffect && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={getEffectStyle()}
        >
          {/* Screen flash for critical hits */}
          {type === 'critical' && (
            <motion.div
              className="absolute inset-0 bg-red-500/20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, times: [0, 0.2, 1] }}
            />
          )}

          {/* Celebration text */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1, times: [0, 0.5, 1] }}
          >
            {type === 'levelup' && '🎉 LEVEL UP! 🎉'}
            {type === 'critical' && '💥 CRITICAL! 💥'}
            {type === 'success' && '✅ SUCCESS! ✅'}
            {type === 'confetti' && '🎊 CELEBRATION! 🎊'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationEffect;
