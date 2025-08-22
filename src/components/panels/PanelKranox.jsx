import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from '@arwes/react-animator';
import { Kranox } from '@arwes/react-frames';
import { css } from '../../styled-system/css';

const PanelKranox = ({ 
  children, 
  title, 
  subtitle, 
  density = 'normal',
  variant = 'normal',
  className,
  ...props 
}) => {
  const paddingMap = {
    compact: 'sm',
    normal: 'md',
    comfortable: 'lg',
  };

  const padding = paddingMap[density] || 'md';

  const frameStyles = css({
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent',
      outlineOffset: '4px',
    },
  });

  return (
    <Animated>
      <Kranox
        className={`${frameStyles} ${className || ''}`}
        strokeWidth={variant === 'loud' ? 2 : 1}
        color={variant === 'loud' ? '#ff0080' : '#00d9ff'}
        cornerLength={20}
        padding={0}
        tabIndex={0}
        {...props}
      >
        <div className={css({
          padding,
          backgroundColor: 'rgba(2, 30, 38, 0.6)',
          position: 'relative',
        })}>
          {(title || subtitle) && (
            <div className={css({
              marginBottom: padding,
              borderBottom: '1px solid',
              borderColor: 'muted',
              paddingBottom: 'sm',
            })}>
              {title && (
                <h3 className={css({
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'primary',
                  margin: 0,
                })}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={css({
                  fontSize: '0.875rem',
                  color: 'muted',
                  marginTop: 'xs',
                  margin: 0,
                })}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div className={css({ position: 'relative' })}>
            {children}
          </div>
        </div>
      </Kranox>
    </Animated>
  );
};

PanelKranox.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  density: PropTypes.oneOf(['compact', 'normal', 'comfortable']),
  variant: PropTypes.oneOf(['normal', 'loud']),
  className: PropTypes.string,
};

export default PanelKranox;