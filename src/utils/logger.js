const logger = {
  error(message, context = {}) {
    // Centralized error logging
    console.error(message, context);
  },
};

export default logger;
