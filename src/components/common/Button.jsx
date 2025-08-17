import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../motion/reduced';
import { spring } from '../../motion/tokens';
import styles from './Button.module.css';

export default function Button({ className = '', type = 'button', children, ...props }) {
  const reduce = useReducedMotion();
  const hover = reduce ? undefined : { scale: 1.02 };
  const tap = reduce ? undefined : { scale: 0.98 };
  const transition = reduce ? { duration: 0 } : spring;

  return (
    <motion.button
      type={type}
      className={`${styles.button} ${className}`}
      whileHover={hover}
      whileTap={tap}
      transition={transition}
      {...props}
    >
      {children}
    </motion.button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
};
