import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import styles from './ExportModal.module.css';
import Button from './common/Button';
import ButtonGroup from './common/ButtonGroup';
import { endUserPrompt, serverSidePrompt, markdownTemplate } from '../data/prompts';

export default function PromptsModal({ isOpen, onClose }) {
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <motion.div
            className={styles.modal}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
          >
            <h2 className={styles.title}>Prompts for Import</h2>

            <div style={{ textAlign: 'left', marginBottom: '12px' }}>
              <p style={{ marginBottom: '8px' }}>
                Use these copy-paste prompts to generate import-ready summaries.
              </p>
              <ButtonGroup>
                <Button onClick={() => handleCopy('End-user prompt copied', endUserPrompt)}>
                  Copy End‑User Prompt
                </Button>
                <Button onClick={() => handleCopy('Server prompt copied', serverSidePrompt)}>
                  Copy Server Prompt
                </Button>
                <Button onClick={() => handleCopy('Markdown template copied', markdownTemplate)}>
                  Copy Markdown Template
                </Button>
              </ButtonGroup>
              {copied && <div className={styles.message}>{copied}</div>}
            </div>

            <ButtonGroup>
              <Button onClick={onClose}>Close</Button>
            </ButtonGroup>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

PromptsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
