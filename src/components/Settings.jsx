import React from 'react';
import { useTheme } from '../state/ThemeContext.jsx';

const Settings = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div>
      <label htmlFor="theme-select">Theme:</label>{' '}
      <select id="theme-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
        {themes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Settings;
