import React from 'react';
import { useTheme } from '../state/ThemeContext.jsx';
import { useSettings } from '../state/SettingsContext.jsx';

const Settings = () => {
  const { theme, setTheme, themes } = useTheme();
  const { autoXpOnMiss, setAutoXpOnMiss } = useSettings();

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
      <label htmlFor="xp-on-miss">
        <input
          id="xp-on-miss"
          type="checkbox"
          checked={autoXpOnMiss}
          onChange={(e) => setAutoXpOnMiss(e.target.checked)}
        />{' '}
        Auto XP on miss
      </label>
    </div>
  );
};

export default Settings;
