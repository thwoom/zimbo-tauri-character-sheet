import PropTypes from 'prop-types';
import styles from './Message.module.css';

const Message = ({ type = 'error', children }) => {
  return <p className={`${styles.message} ${styles[`message-${type}`]}`}>{children}</p>;
};

export default Message;

Message.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
};
