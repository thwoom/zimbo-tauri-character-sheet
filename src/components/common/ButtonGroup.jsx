import PropTypes from 'prop-types';
import { css } from '../../styled-system/css';

export default function ButtonGroup({ className = '', children, ...props }) {
  return (
    <div
      className={`${css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'sm',
        alignItems: 'center',
        justifyContent: 'flex-start',
      })} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

ButtonGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
