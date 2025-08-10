import './Message.css';

const Message = ({ type = 'error', children }) => {
  return <p className={`message message-${type}`}>{children}</p>;
};

export default Message;
