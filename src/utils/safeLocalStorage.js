const safeLocalStorage = {
  getItem(key, fallback = null) {
    try {
      if (typeof localStorage === 'undefined') return fallback;
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  },

  setItem(key, value) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, value);
    } catch (error) {
      // ignore
    }
  },

  removeItem(key) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      // ignore
    }
  },
};

export default safeLocalStorage;
