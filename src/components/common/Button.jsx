import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useReducedMotion } from '../../motion/reduced';
import { spring } from '../../motion/tokens';
import { css } from '../../styled-system/css';

export default function Button({ className = '', type = 'button', children, ...props }) {
  const reduce = useReducedMotion();
  const hover = reduce ? undefined : { scale: 1.02 };
  const tap = reduce ? undefined : { scale: 0.98 };
  const transition = reduce ? { duration: 0 } : spring;

  return (
    <motion.button
      type={type}
      className={`${css({
        backgroundColor: 'surface',
        color: 'text',
        border: '1px solid',
        borderColor: 'primary',
        borderRadius: 'md',
        padding: 'sm',
        fontSize: 'sm',
        fontWeight: 'medium',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'primary',
          color: 'background',
        },
        '&:focus': {
          outline: '2px solid',
          outlineColor: 'accent',
          outlineOffset: '2px',
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      })} ${className}`}
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
