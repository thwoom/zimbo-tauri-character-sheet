import React from 'react';
import { useTheme } from '../state/ThemeContext';
import { useSettings } from '../state/SettingsContext';

const Settings = () => {
  const { theme, setTheme, themes } = useTheme();
  const { autoXpOnMiss, setAutoXpOnMiss, showDiagnostics, setShowDiagnostics } = useSettings();
  const themeLabels = {
    legacy: 'Legacy',
    'cosmic-v2': 'Cosmic v2',
    classic: 'Classic',
    moebius: 'Moebius',
    arwes: 'Arwes Space',
  };

  return (
    <div>
      <label htmlFor="theme-select">Theme:</label>{' '}
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        data-testid="theme-select"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {themeLabels[t] || t}
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
      {import.meta.env.DEV && (
        <label htmlFor="show-diagnostics">
          <input
            id="show-diagnostics"
            type="checkbox"
            checked={showDiagnostics}
            onChange={(e) => setShowDiagnostics(e.target.checked)}
          />{' '}
          Show diagnostics overlay
        </label>
      )}
    </div>
  );
};

export default Settings;
