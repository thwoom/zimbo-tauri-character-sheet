import PropTypes from 'prop-types';
import React from 'react';
import styles from './ButtonGroup.module.css';

export default function ButtonGroup({ className = '', children, ...props }) {
  return (
    <div className={`${styles.group} ${className}`} {...props}>
      {children}
    </div>
  );
}

ButtonGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
