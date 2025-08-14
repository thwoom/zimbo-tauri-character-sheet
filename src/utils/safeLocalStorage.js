const safeLocalStorage = {
  getItem(key, fallback = null) {
    try {
      if (typeof localStorage === 'undefined') return fallback;
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      console.error('Failed to get localStorage item', key, error);
      return fallback;
    }
  },

  setItem(key, value) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to set localStorage item', key, error);
    }
  },

  removeItem(key) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove localStorage item', key, error);
    }
  },
};

export default safeLocalStorage;
