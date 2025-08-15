import PropTypes from 'prop-types';
import React from 'react';
import styles from './Button.module.css';

export default function Button({ className = '', type = 'button', children, ...props }) {
  return (
    <button type={type} className={`${styles.button} ${className}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
};
