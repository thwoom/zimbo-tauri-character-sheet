import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './CommandPalette.module.css';

export default function CommandPalette({ isOpen, onClose, commands }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    return () => {};
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  const runCommand = (cmd) => {
    try {
      cmd.action();
    } finally {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={styles.modal}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
            role="dialog"
            aria-label="Command Palette"
          >
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Type a command…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Command search"
            />
            <ul className={styles.list} role="listbox">
              {filtered.length === 0 && <li className={styles.empty}>No commands</li>}
              {filtered.map((cmd) => (
                <li key={cmd.id}>
                  <button
                    className={styles.item}
                    onClick={() => runCommand(cmd)}
                    role="option"
                    aria-label={cmd.label}
                  >
                    {cmd.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

CommandPalette.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commands: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
    }),
  ).isRequired,
};
