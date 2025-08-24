import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from '@arwes/react-animator';
import { Kranox } from '@arwes/react-frames';

const PanelKranox = ({
  children,
  title,
  subtitle,
  density = 'normal',
  variant = 'normal',
  className,
  style,
  ...props
}) => {
  const paddingMap = {
    compact: '0.5rem',
    normal: '1rem',
    comfortable: '1.5rem',
  };

  const padding = paddingMap[density] || '1rem';

  const frameStyles = {
    outline: 'none',
  };

  const focusStyles = {
    outline: '2px solid #ffa726',
    outlineOffset: '4px',
  };

  return (
    <Animated>
      <Kranox
        style={{ ...frameStyles, ...style }}
        className={className}
        strokeWidth={variant === 'loud' ? 2 : 1}
        color={variant === 'loud' ? '#ff0080' : '#00d9ff'}
        cornerLength={20}
        padding={0}
        tabIndex={0}
        onFocus={(e) => {
          Object.assign(e.target.style, focusStyles);
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none';
        }}
        {...props}
      >
        <div
          style={{
            padding,
            backgroundColor: 'rgba(2, 30, 38, 0.6)',
            position: 'relative',
          }}
        >
          {(title || subtitle) && (
            <div
              style={{
                marginBottom: padding,
                borderBottom: '1px solid #456c74',
                paddingBottom: '0.5rem',
              }}
            >
              {title && (
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#00d9ff',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#456c74',
                    marginTop: '0.25rem',
                    margin: 0,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div style={{ position: 'relative' }}>{children}</div>
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
  style: PropTypes.object,
};

export default PanelKranox;
