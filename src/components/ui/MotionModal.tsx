import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { backdropVariants, modalVariants } from '../../motion/variants';
import { cn } from '../../utils/cn';

interface MotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  neonBorder?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const MotionModal: React.FC<MotionModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  neonBorder = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 border-0 cursor-pointer"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            aria-label="Close modal backdrop"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className={cn(
                'relative w-full bg-glass border border-glass-border rounded-lg shadow-glass backdrop-blur-md overflow-hidden',
                neonBorder && 'border-neon shadow-neon',
                sizeClasses[size],
                className,
              )}
            >
              {/* Header */}
              {title && (
                <div className="px-6 py-4 border-b border-glass-border bg-glass/50">
                  <h2 className="text-lg font-heading font-semibold text-fg">{title}</h2>
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-muted hover:text-fg transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MotionModal;
